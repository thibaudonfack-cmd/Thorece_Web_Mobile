package cipestudio.service;

import cipestudio.dto.page.BookContentRequestDTO;
import cipestudio.dto.page.BookContentResponseDTO;
import cipestudio.enums.BookStatus;
import cipestudio.model.Book;
import cipestudio.model.Page;
import cipestudio.repository.BookRepository;
import cipestudio.repository.PageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PageService {
    private final BookRepository bookRepository;
    private final SeaweedFStorageService seaweedFStorageService;
    private final PageRepository pageRepository;

    public BookContentResponseDTO updateBookContent(Long bookId, BookContentRequestDTO requestDTO) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "livre non trouvé"));
        
        Page page = getOrCreatePage(book);
        String url;

        switch (requestDTO.getBookStatus()){
            case BookStatus.PUBLISHED :
                url = handlePublishing(page, requestDTO.getBookContent(), bookId);
                break;
            case BookStatus.DRAFT :
                url = handleDrafting(page, requestDTO.getBookContent());
                break;
            default :
                throw new IllegalArgumentException("Statut de livre non supporté");
        }
        
        pageRepository.save(page);
        return new BookContentResponseDTO(url, LocalDateTime.now());
    }

    public void deleteBookContent(Book book) {
        if (book.getPages() == null) return;
        
        if (book.getPages().getDraftUrl() != null) {
            seaweedFStorageService.deleteFile(book.getPages().getDraftUrl());
        }
        if (book.getPages().getPublishedUrl() != null) {
            seaweedFStorageService.deleteFile(book.getPages().getPublishedUrl());
        }
    }

    private Page getOrCreatePage(Book book) {
        try {
            return pageRepository.findByBookId(book.getId())
                    .orElseGet(() -> {
                        Page newPage = new Page();
                        newPage.setBook(book);
                        return pageRepository.save(newPage);
                    });
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return pageRepository.findByBookId(book.getId())
                    .orElseThrow(() -> new IllegalStateException("Erreur intégrité données page", e));
        }
    }

    private String handlePublishing(Page page, Object content, Long bookId) {
        String timestamp = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss").format(LocalDateTime.now());
        String customFileName = "books/" + bookId + "/published/" + timestamp + ".json";

        String publishedUrl = seaweedFStorageService.uploadJson(content, customFileName);
        page.setPublishedUrl(publishedUrl);
        
        // Mise à jour automatique du statut du livre en base de données
        Book book = page.getBook();
        if (book.getStatus() != BookStatus.PUBLISHED) {
            book.setStatus(BookStatus.PUBLISHED);
            bookRepository.save(book);
        }
        
        return publishedUrl;
    }

    private String handleDrafting(Page page, Object content) {
        if(page.getDraftUrl() != null && !page.getDraftUrl().isEmpty()){
            try {
                seaweedFStorageService.deleteFile(page.getDraftUrl());
            } catch (Exception e){
                System.err.println("Erreur suppression ancien brouillon : "+e.getMessage());
            }
        }
        
        String draftUrl = seaweedFStorageService.uploadJson(content);
        page.setDraftUrl(draftUrl);
        return draftUrl;
    }

    public BookContentResponseDTO getDraftContent(Long bookId) {
        Page page = pageRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "page non trouvé"));
        return new BookContentResponseDTO(page.getDraftUrl(), page.getUpdateAt());
    }
    public BookContentResponseDTO getPublishedContent(Long bookId) {
        Page page = pageRepository.findByBookId(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "page non trouvé"));
        return new BookContentResponseDTO(page.getPublishedUrl(), page.getUpdateAt());
    }
}
