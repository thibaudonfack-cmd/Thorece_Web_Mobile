package cipestudio.repository;

import cipestudio.model.Book;
import cipestudio.model.ReadingProgress;
import cipestudio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {
    Optional<ReadingProgress> findByReaderAndBook(User reader, Book book);
    Optional<ReadingProgress> findByReaderIdAndBookId(Long readerId, Long bookId);
    void deleteByBook(Book book);
    List<ReadingProgress> findByReaderAndIsOwnedTrue(User reader);
    List<ReadingProgress> findByBook(Book book);
}
