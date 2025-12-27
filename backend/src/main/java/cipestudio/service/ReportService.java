package cipestudio.service;

import cipestudio.dto.report.ReportRequestDTO;
import cipestudio.mapper.ReportMapper;
import cipestudio.model.Book;
import cipestudio.model.Report;
import cipestudio.model.User;
import cipestudio.repository.BookRepository;
import cipestudio.repository.ReportRepository;
import cipestudio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ReportMapper reportMapper;

    @Transactional
    public void createReport(ReportRequestDTO request, Long reporterId){
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livre introuvable"));

        if (reportRepository.existsByReporterAndBook(reporter, book)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Vous avez déjà signalé ce livre.");
        }
        Report report = reportMapper.toNewEntity(request, reporter, book);
        reportRepository.save(report);
    }
}
