package cipestudio.service;

import cipestudio.dto.collection.CollectionRequestDTO;
import cipestudio.dto.collection.CollectionResponseDTO;
import cipestudio.dto.user.URLResponseDTO;
import cipestudio.mapper.CollectionMapper;
import cipestudio.model.Book;
import cipestudio.model.Collection;
import cipestudio.model.ReadingProgress;
import cipestudio.model.User;
import cipestudio.repository.BookRepository;
import cipestudio.repository.CollectionRepository;
import cipestudio.repository.ReadingProgressRepository;
import cipestudio.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CollectionServiceTest {

    @Mock private CollectionRepository collectionRepository;
    @Mock private UserRepository userRepository;
    @Mock private CollectionMapper collectionMapper;
    @Mock private SeaweedFStorageService seaweedfsStorageService;
    @Mock private BookRepository bookRepository;
    @Mock private ReadingProgressRepository readingProgressRepository;

    @InjectMocks
    private CollectionService collectionService;

    @Test
    void createCollection_ShouldSaveCollection() {
        Long editorId = 1L;
        CollectionRequestDTO request = new CollectionRequestDTO();
        request.setName("Ma Collection");
        User editor = new User();
        Collection collection = new Collection();
        CollectionResponseDTO response = new CollectionResponseDTO();

        when(userRepository.findById(editorId)).thenReturn(Optional.of(editor));
        when(collectionMapper.toEntity(request, editor)).thenReturn(collection);
        when(collectionRepository.save(collection)).thenReturn(collection);
        when(collectionMapper.toResponse(collection)).thenReturn(response);

        CollectionResponseDTO result = collectionService.createCollection(request, editorId);

        assertNotNull(result);
        verify(collectionRepository).save(collection);
    }

    @Test
    void removeBookFromCollection_ShouldUpdateReadingProgress_WhenBookOrphaned() {
        // ARRANGE
        Long colId = 1L;
        Long bookId = 2L;

        Collection collection = new Collection();
        collection.setId(colId);

        Book book = new Book();
        book.setId(bookId);
        // Le livre est dans la collection actuelle
        collection.addBook(book);

        when(collectionRepository.findById(colId)).thenReturn(Optional.of(collection));
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));

        // Mock des progressions existantes
        ReadingProgress p1 = new ReadingProgress(); p1.setIsOwned(true);
        ReadingProgress p2 = new ReadingProgress(); p2.setIsOwned(true);
        when(readingProgressRepository.findByBook(book)).thenReturn(List.of(p1, p2));

        // ACT
        collectionService.removeBookFromCollection(colId, bookId);

        // ASSERT
        // 1. Le livre doit être retiré de la collection
        assertFalse(collection.getBooks().contains(book));
        verify(collectionRepository).save(collection);

        // 2. Comme le livre n'est plus dans aucune collection (liste vide),
        // on doit vérifier que les progressions ont été mises à jour (isOwned -> false)
        // et non supprimées.
        assertFalse(p1.getIsOwned());
        assertFalse(p2.getIsOwned());
        verify(readingProgressRepository).saveAll(List.of(p1, p2));

        // On vérifie qu'on n'a PAS appelé delete
        verify(readingProgressRepository, never()).deleteByBook(any());
    }

    @Test
    void deleteCollection_ShouldHandleOrphanedBooks() {
        Long colId = 1L;
        Collection collection = new Collection();
        collection.setId(colId);

        Book book = new Book();
        book.setId(100L);
        collection.addBook(book); // Le livre est lié à cette collection

        when(collectionRepository.findById(colId)).thenReturn(Optional.of(collection));
        // Mock du rechargement du livre après flush
        when(bookRepository.findById(100L)).thenReturn(Optional.of(book));

        // Mock progression
        ReadingProgress prog = new ReadingProgress();
        prog.setIsOwned(true);
        when(readingProgressRepository.findByBook(book)).thenReturn(List.of(prog));

        // ACT
        collectionService.deleteCollection(colId);

        // ASSERT
        // Comme on supprime la seule collection du livre, il devient orphelin
        // Donc son statut 'isOwned' doit passer à false pour les lecteurs
        assertFalse(prog.getIsOwned());
        verify(readingProgressRepository).saveAll(anyList());
        verify(collectionRepository).delete(collection);
    }



    //  test update - mise à jour réussie de tous les champs
    @Test
    void updateCollection_ShouldUpdateAndReturnUpdatedCollection() {
        // ARRANGE
        Long collectionId = 100L;
        
        Collection existingCollection = new Collection();
        existingCollection.setId(collectionId);
        existingCollection.setName("Ancien nom");
        existingCollection.setDescription("Ancienne description");
        
        CollectionRequestDTO updateRequest = new CollectionRequestDTO();
        updateRequest.setName("Nouveau nom");
        updateRequest.setDescription("Nouvelle description");
        updateRequest.setTags("nouveau,tags");
        updateRequest.setIcon("");
        
        when(collectionRepository.findById(collectionId))
            .thenReturn(Optional.of(existingCollection));
        when(collectionRepository.save(any(Collection.class)))
            .thenReturn(existingCollection);
        
        CollectionResponseDTO expectedResponse = new CollectionResponseDTO();
        expectedResponse.setId(collectionId);
        expectedResponse.setName("Nouveau nom");
        expectedResponse.setDescription("Nouvelle description");
        expectedResponse.setTags("nouveau,tags");
        expectedResponse.setIcon("");
        
        when(collectionMapper.toResponse(existingCollection))
            .thenReturn(expectedResponse);

        // ACT
        CollectionResponseDTO result = collectionService.updateCollection(collectionId, updateRequest);

        // ASSERT
        assertNotNull(result);
        assertEquals(collectionId, result.getId());
        assertEquals("Nouveau nom", result.getName());
        assertEquals("Nouvelle description", result.getDescription());
        assertEquals("nouveau,tags", result.getTags());
        assertEquals("", result.getIcon());
        
        verify(collectionRepository, times(1)).findById(collectionId);
        verify(collectionMapper, times(1))
            .updateCollectionFromDto(eq(updateRequest), eq(existingCollection));
        verify(collectionRepository, times(1)).save(existingCollection);
    }
    
    // test update -  collection non trouvée (404)
    @Test
    void updateCollection_ShouldThrowException_WhenCollectionNotFound() {
        // ARRANGE
        Long nonExistentId = 999L;
        CollectionRequestDTO updateRequest = new CollectionRequestDTO();
        updateRequest.setName("Test");
        
        when(collectionRepository.findById(nonExistentId))
            .thenReturn(Optional.empty());

        // ACT & ASSERT
        assertThrows(
            ResponseStatusException.class,
            () -> collectionService.updateCollection(nonExistentId, updateRequest)
        );
        
        verify(collectionRepository, never()).save(any());
        verify(collectionMapper, never()).updateCollectionFromDto(any(), any());
    }
    
    // test update - mise à jour partielle (seulement certains champs)
    @Test
    void updateCollection_ShouldUpdateOnlyProvidedFields_WhenPartialUpdate() {
        // ARRANGE
        Long collectionId = 100L;
        
        Collection existingCollection = new Collection();
        existingCollection.setId(collectionId);
        existingCollection.setName("Ancien nom");
        existingCollection.setDescription("Description conservée");
        existingCollection.setTags("tags,conservés");
        existingCollection.setIcon("");
        
        // Requête partielle : seulement le nom
        CollectionRequestDTO partialRequest = new CollectionRequestDTO();
        partialRequest.setName("Nom modifié");
        // description, tags, icon = null (ne doivent PAS modifier les valeurs existantes)
        
        when(collectionRepository.findById(collectionId))
            .thenReturn(Optional.of(existingCollection));
        when(collectionRepository.save(any(Collection.class)))
            .thenReturn(existingCollection);
        
        CollectionResponseDTO response = new CollectionResponseDTO();
        response.setId(collectionId);
        response.setName("Nom modifié");
        response.setDescription("Description conservée"); // Conservée !
        response.setTags("tags,conservés"); // Conservés !
        response.setIcon(""); // Conservé !
        
        when(collectionMapper.toResponse(existingCollection))
            .thenReturn(response);

        // ACT
        CollectionResponseDTO result = collectionService.updateCollection(collectionId, partialRequest);

        // ASSERT
        verify(collectionMapper, times(1))
            .updateCollectionFromDto(eq(partialRequest), eq(existingCollection));
        
        // Vérifier que seul le nom a été modifié
        assertEquals("Nom modifié", result.getName());
        assertEquals("Description conservée", result.getDescription());
        assertEquals("tags,conservés", result.getTags());
        assertEquals("", result.getIcon());
    }
    // ==================== TESTS POUR updateCollectionCover ====================

    @Test
    void updateCollectionCover_ShouldUploadNewCover_WhenOwnerIsAuthorized() {
        // ARRANGE
        Long collectionId = 1L;
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "cover.jpg",
                "image/jpeg",
                "image content".getBytes()
        );

        Collection collection = new Collection();
        collection.setId(collectionId);
        collection.setCoverUrl(null);

        String expectedUrl = "http://localhost:9000/covers/new-cover.jpg";

        when(collectionRepository.findById(collectionId)).thenReturn(Optional.of(collection));
        when(seaweedfsStorageService.uploadFile(file)).thenReturn(expectedUrl);
        when(collectionRepository.save(collection)).thenReturn(collection);

        // ACT
        URLResponseDTO result = collectionService.updateCollectionCover(collectionId, file);

        // ASSERT
        assertNotNull(result);
        assertEquals(expectedUrl, result.getUrl());
        assertEquals(expectedUrl, collection.getCoverUrl());
        verify(seaweedfsStorageService).uploadFile(file);
        verify(collectionRepository).save(collection);
    }

    @Test
    void updateCollectionCover_ShouldDeleteOldCover_WhenReplacingExistingCover() {
        // ARRANGE
        Long collectionId = 1L;
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "new-cover.jpg",
                "image/jpeg",
                "new image content".getBytes()
        );

        String oldCoverUrl = "http://localhost:9000/covers/old-cover.jpg";
        String newCoverUrl = "http://localhost:9000/covers/new-cover.jpg";

        Collection collection = new Collection();
        collection.setId(collectionId);
        collection.setCoverUrl(oldCoverUrl);

        when(collectionRepository.findById(collectionId)).thenReturn(Optional.of(collection));
        when(seaweedfsStorageService.uploadFile(file)).thenReturn(newCoverUrl);
        when(collectionRepository.save(collection)).thenReturn(collection);

        // ACT
        URLResponseDTO result = collectionService.updateCollectionCover(collectionId, file);

        // ASSERT
        assertNotNull(result);
        assertEquals(newCoverUrl, result.getUrl());
        assertEquals(newCoverUrl, collection.getCoverUrl());
        verify(seaweedfsStorageService).deleteFile(oldCoverUrl);
        verify(seaweedfsStorageService).uploadFile(file);
    }

    @Test
    void updateCollectionCover_ShouldThrowNotFound_WhenCollectionDoesNotExist() {
        // ARRANGE
        Long collectionId = 999L;
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "cover.jpg",
                "image/jpeg",
                "image content".getBytes()
        );

        when(collectionRepository.findById(collectionId)).thenReturn(Optional.empty());

        // ACT & ASSERT
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> collectionService.updateCollectionCover(collectionId, file)
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verify(seaweedfsStorageService, never()).uploadFile(any());
    }

    @Test
    void updateCollectionCover_ShouldContinue_WhenDeleteOldCoverFails() {
        // ARRANGE
        Long collectionId = 1L;
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "new-cover.jpg",
                "image/jpeg",
                "new image content".getBytes()
        );

        String oldCoverUrl = "http://localhost:9000/covers/old-cover.jpg";
        String newCoverUrl = "http://localhost:9000/covers/new-cover.jpg";

        Collection collection = new Collection();
        collection.setId(collectionId);
        collection.setCoverUrl(oldCoverUrl);

        when(collectionRepository.findById(collectionId)).thenReturn(Optional.of(collection));
        doThrow(new RuntimeException("Storage error")).when(seaweedfsStorageService).deleteFile(oldCoverUrl);
        when(seaweedfsStorageService.uploadFile(file)).thenReturn(newCoverUrl);
        when(collectionRepository.save(collection)).thenReturn(collection);

        // ACT
        URLResponseDTO result = collectionService.updateCollectionCover(collectionId, file);

        // ASSERT - Should still succeed despite delete error
        assertNotNull(result);
        assertEquals(newCoverUrl, result.getUrl());
        verify(seaweedfsStorageService).uploadFile(file);
        verify(collectionRepository).save(collection);
    }
}