package cipestudio.repository;

import cipestudio.model.User;
import cipestudio.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for managing {@link User} entities.
 * Provides CRUD operations and custom query methods for accessing user data.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findAllByRole(Role role);

    List<User> findAllByIsBlocked(boolean isBlocked);
    Optional<User> findByAvatar(String avatar);

}
