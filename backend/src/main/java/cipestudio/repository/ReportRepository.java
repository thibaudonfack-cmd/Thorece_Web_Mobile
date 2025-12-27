package cipestudio.repository;

import cipestudio.model.Book;
import cipestudio.model.Report;
import cipestudio.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository  extends JpaRepository<Report, Long>{
    List<Report> findByBookId(Long bookId);
    boolean existsByReporterAndBook(User reporter, Book book);
}
