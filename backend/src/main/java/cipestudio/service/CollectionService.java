package cipestudio.service;

import cipestudio.dto.collection.CollectionDetailResponseDTO;
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
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollectionService{
    private final CollectionRepository collectionRepository;
    private final UserRepository userRepository;
    private final CollectionMapper collectionMapper;
    private final SeaweedFStorageService SEAWEEDFSStorageService;
    private final BookRepository bookRepository;
    private final ReadingProgressRepository readingProgressRepository;


    @Transactional
    public CollectionResponseDTO createCollection(CollectionRequestDTO request, Long editorId){
        User editor = userRepository.findById(editorId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Éditeur non trouvé")
        );
        Collection collection = collectionMapper.toEntity(request, editor);
        return collectionMapper.toResponse(collectionRepository.save(collection));
    }

    @Transactional
    public URLResponseDTO updateCollectionCover(Long collectionId, MultipartFile file) {
        Collection collection = collectionRepository.findById(collectionId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND,  "Collection non trouvée")
        );
        if(collection.getCoverUrl() != null && !collection.getCoverUrl().isBlank()) {
            try {
                SEAWEEDFSStorageService.deleteFile(collection.getCoverUrl());
            }catch (Exception e) {
                System.err.println("Erreur suppression ancienne cover : " + e.getMessage());
            }
        }
        String url = SEAWEEDFSStorageService.uploadFile(file);
        collection.setCoverUrl(url);
        collectionRepository.save(collection);
        return new URLResponseDTO(url);
    }

    public List<CollectionResponseDTO> getMyCollections(Long editorId){
        User editor = userRepository.findById(editorId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Éditeur non trouvé")
        );
        return collectionRepository.findByEditor(editor).stream()
                .map(collectionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void addBookToCollection(Long collectionId, Long bookId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Collection non trouvée"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livre non trouvé"));

        if (!collection.getBooks().contains(book)) {
            collection.addBook(book);
            collectionRepository.save(collection);
        }
    }

    public CollectionDetailResponseDTO getCollectionById(Long id) {
        Collection collection = collectionRepository.findById(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Collection non trouvée")
        );
        return collectionMapper.toDetailResponse(collection);
    }

    @Transactional
    public void removeBookFromCollection(Long collectionId, Long bookId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Collection non trouvée"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livre non trouvé"));

        collection.removeBook(book);
        collectionRepository.save(collection);
        if (book.getCollections().isEmpty()) {
            List<ReadingProgress> progresses = readingProgressRepository.findByBook(book);
            progresses.forEach(p -> p.setIsOwned(false));
            readingProgressRepository.saveAll(progresses);
        }
    }

    @Transactional
    public void deleteCollection(Long id) {
        Collection collection = collectionRepository.findById(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Collection non trouvée")
        );

        if (collection.getCoverUrl() != null && !collection.getCoverUrl().isBlank()) {
            try {
                SEAWEEDFSStorageService.deleteFile(collection.getCoverUrl());
            } catch (Exception e) {
                System.err.println("Erreur suppression cover MinIO : " + e.getMessage());
            }
        }
        List<Book> affectedBooks = List.copyOf(collection.getBooks());

        if (collection.getBooks() != null) {
            for (Book b : collection.getBooks()) {
                b.getCollections().remove(collection);
            }
            collection.getBooks().clear();
        }

        collectionRepository.saveAndFlush(collection);
        collectionRepository.delete(collection);

        for (Book book : affectedBooks) {
            Book freshBook = bookRepository.findById(book.getId()).orElseThrow(null);

            if (freshBook != null && freshBook.getCollections().isEmpty()){
                List<ReadingProgress> progresses = readingProgressRepository.findByBook(freshBook);
                progresses.forEach(p -> p.setIsOwned(false));
                readingProgressRepository.saveAll(progresses);
            }
        }
    }


    @Transactional
    public CollectionResponseDTO updateCollection(Long collectionId, CollectionRequestDTO request) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Collection non trouvée"));
        
        
        collectionMapper.updateCollectionFromDto(request, collection);
        
        return collectionMapper.toResponse(collectionRepository.save(collection));
    }
    
}
