package cipestudio.security;

import cipestudio.repository.CollectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("collectionSecurity")
@RequiredArgsConstructor
public class CollectionSecurity {
    private final CollectionRepository collectionRepository;
    public boolean isCollectionOwner(Long collectionId, Authentication authentication) {
        if(authentication == null || !authentication.isAuthenticated()) return false;
        Long currentUserId = Long.valueOf(authentication.getName());
        return collectionRepository.findById(collectionId)
                .map(col -> col.getEditor().getId().equals(currentUserId))
                .orElse(false);
    }
}
