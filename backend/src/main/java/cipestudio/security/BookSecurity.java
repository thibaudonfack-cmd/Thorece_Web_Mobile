package cipestudio.security;

import cipestudio.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("bookSecurity")
@RequiredArgsConstructor
public class BookSecurity {

    private final BookRepository bookRepository;

  
    public boolean isBookOwner(Long bookId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        Long currentUserId = Long.valueOf(authentication.getName());
        
        
        return bookRepository.findById(bookId)
            .map(book -> book.getAuthor().getId().equals(currentUserId))
            .orElse(false);
    }
}