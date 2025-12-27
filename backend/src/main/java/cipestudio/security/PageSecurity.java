package cipestudio.security;

import cipestudio.repository.BookRepository;
import cipestudio.repository.PageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("pageSecurity")
@RequiredArgsConstructor
public class PageSecurity {
    private final BookRepository bookRepository;
    public boolean isPageOwner(Long bookId, Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()) return false;
        Long currentUserId = Long.valueOf(authentication.getName());
        return bookRepository.findById(bookId)
                .map(bk -> bk.getAuthor().getId().equals(currentUserId))
                .orElse(false);
    }
}
