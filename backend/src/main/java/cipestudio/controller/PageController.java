package cipestudio.controller;

import cipestudio.dto.page.BookContentRequestDTO;
import cipestudio.dto.page.BookContentResponseDTO;
import cipestudio.service.PageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/page")
@RequiredArgsConstructor
public class PageController {
    private final PageService pageService;

    @PutMapping(value = "/{bookId}/content", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@pageSecurity.isPageOwner(#bookId, authentication) or hasAuthority('SCOPE_ROLE_AUTEUR')")
    public ResponseEntity<BookContentResponseDTO> updateContent(
            @PathVariable Long bookId,
            @Valid @RequestBody BookContentRequestDTO request) {
        return ResponseEntity.ok(pageService.updateBookContent(bookId,request));
    }
    @GetMapping(value = "{bookId}/draft/content")
    @PreAuthorize("@pageSecurity.isPageOwner(#bookId, authentication) or hasAuthority('SCOPE_ROLE_AUTEUR')")
    public ResponseEntity<BookContentResponseDTO> getDraftContent(
            @PathVariable Long bookId) {
        return ResponseEntity.ok(pageService.getDraftContent(bookId));
    }

    @GetMapping(value = "{bookId}/published/content")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BookContentResponseDTO> getPublishedContent(
            @PathVariable Long bookId) {
        return ResponseEntity.ok(pageService.getPublishedContent(bookId));
    }
}
