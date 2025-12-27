package cipestudio.controller;

import cipestudio.dto.book.BookRequestDTO;
import cipestudio.dto.book.BookResponseDTO;
import cipestudio.dto.user.URLResponseDTO;
import cipestudio.service.BookService;
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
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDTO> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @PreAuthorize("hasAuthority('SCOPE_ROLE_AUTEUR')")
    @PostMapping
      public ResponseEntity<BookResponseDTO> createBook(@Valid @RequestBody BookRequestDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        BookResponseDTO createdBook = bookService.createBook(request, Long.valueOf(authentication.getName()));
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBook);
    }

    @GetMapping("/author")
    @PreAuthorize("hasAuthority('SCOPE_ROLE_AUTEUR')")
    public ResponseEntity<List<BookResponseDTO>> getMyBooks() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long authorId = Long.valueOf(authentication.getName());

        List<BookResponseDTO> books = bookService.getBooksByAuthor(authorId);
        return ResponseEntity.ok(books);
    }

    @PreAuthorize("@bookSecurity.isBookOwner(#bookId, authentication)")
    @PostMapping(value = "/{bookId}/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<URLResponseDTO> uploadBookCover(
            @PathVariable Long bookId,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(bookService.updateBookCover(bookId, file));
    }

    @PreAuthorize("@bookSecurity.isBookOwner(#bookId, authentication)")
    @PutMapping("/{bookId}")
    public ResponseEntity<BookResponseDTO> updateBook(
            @PathVariable Long bookId,
            @Valid @RequestBody BookRequestDTO request
    ) {
        return ResponseEntity.ok(bookService.updateBook(bookId, request));
    }
    @GetMapping("/published")
    @PreAuthorize("hasAuthority('SCOPE_ROLE_EDITEUR')")
    public ResponseEntity<List<BookResponseDTO>> getPublishedBooks() {
        return ResponseEntity.ok(bookService.getPublishedBooks());
    }
 
    @PreAuthorize("@bookSecurity.isBookOwner(#bookId, authentication) or hasAuthority('SCOPE_ROLE_AUTEUR')")
    @DeleteMapping("/{bookId}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long bookId) {
        bookService.deleteBook(bookId);
        return ResponseEntity.noContent().build();
    }
    @PreAuthorize("hasAuthority('SCOPE_ROLE_ENFANT')")
    @GetMapping("/bag")
    public ResponseEntity<List<BookResponseDTO>> getMyBag() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.valueOf(authentication.getName());
        return ResponseEntity.ok(bookService.getMyBag(userId));
    }
    @PreAuthorize("hasAuthority('SCOPE_ROLE_ENFANT')")
    @GetMapping("/public")
    public ResponseEntity<List<BookResponseDTO>> getPublicLibrary() {
        return ResponseEntity.ok(bookService.getPublicLibraryBooks());
    }
}


