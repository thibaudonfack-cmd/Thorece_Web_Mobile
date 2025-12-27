package cipestudio.repository;

import cipestudio.model.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PageRepository  extends JpaRepository<Page, Long> {
    Optional<Page> findByBookId(Long bookId);
}
