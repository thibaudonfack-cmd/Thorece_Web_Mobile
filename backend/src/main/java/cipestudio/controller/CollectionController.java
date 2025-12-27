package cipestudio.controller;

import cipestudio.dto.book.AddBookRequestDTO;
import cipestudio.dto.collection.CollectionDetailResponseDTO;
import cipestudio.dto.collection.CollectionRequestDTO;
import cipestudio.dto.collection.CollectionResponseDTO;
import cipestudio.dto.user.URLResponseDTO;
import cipestudio.service.CollectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/collections")
@RequiredArgsConstructor
public class CollectionController {
    private final CollectionService collectionService;

    @PostMapping
    @PreAuthorize("hasAuthority('SCOPE_ROLE_EDITEUR')")
    public ResponseEntity<CollectionResponseDTO> createCollection(@Valid @RequestBody CollectionRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long editorId = Long.valueOf(auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(collectionService.createCollection(request, editorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollectionDetailResponseDTO> getCollectionById(@PathVariable Long id) {
        return ResponseEntity.ok(collectionService.getCollectionById(id));
    }

    @PostMapping(value = "/{id}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("@collectionSecurity.isCollectionOwner(#id, authentication)")
    public ResponseEntity<URLResponseDTO> uploadCover(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(collectionService.updateCollectionCover(id, file));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('SCOPE_ROLE_EDITEUR')")
    public ResponseEntity<List<CollectionResponseDTO>> getMyCollections() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long editorId = Long.valueOf(auth.getName());
        return ResponseEntity.ok(collectionService.getMyCollections(editorId));
    }

    @PostMapping("/{id}/books")
    @PreAuthorize("@collectionSecurity.isCollectionOwner(#id, authentication)")
    public ResponseEntity<Void> addBookToCollection(@Valid @PathVariable Long id, @RequestBody AddBookRequestDTO request) {
        collectionService.addBookToCollection(id, request.getBookId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/books/{bookId}")
    @PreAuthorize("@collectionSecurity.isCollectionOwner(#id, authentication)")
    public ResponseEntity<Void> removeBookFromCollection(@PathVariable Long id, @PathVariable Long bookId) {
        collectionService.removeBookFromCollection(id, bookId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("@collectionSecurity.isCollectionOwner(#id, authentication)")
    public ResponseEntity<CollectionResponseDTO> updateCollection(
            @PathVariable Long id, 
            @Valid @RequestBody CollectionRequestDTO request) {
        return ResponseEntity.ok(collectionService.updateCollection(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@collectionSecurity.isCollectionOwner(#id, authentication) or hasAuthority('SCOPE_ROLE_ADMIN')")
    public ResponseEntity<Void> deleteCollection(@PathVariable Long id) {
        collectionService.deleteCollection(id);
        return ResponseEntity.noContent().build();
    }

 
}
