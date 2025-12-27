package cipestudio.repository;

import cipestudio.enums.BookStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import cipestudio.model.Book;
import cipestudio.model.User;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByAuthor(User author);

    List<Book> findByStatus(BookStatus bookStatus);

    List<Book> findDistinctByCollectionsIsNotEmptyAndStatus(BookStatus bookStatus);
}