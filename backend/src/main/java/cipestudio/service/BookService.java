package cipestudio.service;

import cipestudio.dto.book.BookRequestDTO;
import cipestudio.dto.book.BookResponseDTO;
import cipestudio.dto.user.URLResponseDTO;
import cipestudio.enums.BookStatus;
import cipestudio.mapper.BookMapper;
import cipestudio.mapper.ReadingProgressMapper;
import cipestudio.model.*;
import cipestudio.repository.BookRepository;
import cipestudio.repository.ReadingProgressRepository;
import cipestudio.repository.ReportRepository;
import cipestudio.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService{

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BookMapper bookMapper;
    private final SeaweedFStorageService seaweedFStorageService;
    private final ReadingProgressRepository readingProgressRepository;
    private final ReadingProgressMapper readingProgressMapper;
    private final ReportRepository reportRepository;
    private final PageService pageService;
    public BookResponseDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livre non trouvé"));
        return bookMapper.toResponse(book);
    }

    @Transactional
    public BookResponseDTO createBook(BookRequestDTO request, Long authorId) {
        
        User author = userRepository.findById(authorId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Auteur non trouvé"));

        Book book = bookMapper.toEntity(request,author);

        return bookMapper.toResponse(bookRepository.save(book));
    }

    @Transactional
    public URLResponseDTO updateBookCover(Long bookId, MultipartFile file) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livre non trouvé"));

        if (book.getCoverUrl() != null && !book.getCoverUrl().isBlank()) {
            try {
                seaweedFStorageService.deleteFile(book.getCoverUrl());
            } catch (Exception e) {
                System.err.println("Erreur suppression ancienne cover : " + e.getMessage());
            }
        }

        String imageUrl = seaweedFStorageService.uploadFile(file);

        book.setCoverUrl(imageUrl);
        bookRepository.save(book);

        return new URLResponseDTO(imageUrl);
    }


    public List<BookResponseDTO> getBooksByAuthor(Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Auteur non trouvé"));

        return bookRepository.findByAuthor(author).stream()
                .map(bookMapper::toResponse)
                .collect(Collectors.toList());
    }
    public List<BookResponseDTO> getPublishedBooks() {
        return bookRepository.findByStatus(BookStatus.PUBLISHED).stream()
                .map(bookMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookResponseDTO updateBook(Long id, BookRequestDTO request) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livre non trouvé"));

        bookMapper.updateBookFromDto(request, book);
        
        book = bookRepository.save(book);
        return bookMapper.toResponse(book);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livre non trouvé"));
        if(book.getCoverUrl() != null && !book.getCoverUrl().isBlank()) {
            try {
                seaweedFStorageService.deleteFile(book.getCoverUrl());
            } catch (Exception e) {
                System.err.println("Erreur suppression ancienne cover : " + e.getMessage());
            }
        }
        if(book.getCollections() != null){
            for(Collection collection : book.getCollections()){
                collection.getBooks().remove(book);
            }
            book.getCollections().clear();
        }
        pageService.deleteBookContent(book);
        readingProgressRepository.deleteByBook(book);
        List<Report> reports = reportRepository.findByBookId(book.getId());
        reportRepository.deleteAll(reports);
        bookRepository.delete(book);
    }

    @Transactional
    public void addBookToBag(Long userId, Long bookId) {
        User reader = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lecteur introuvable"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livre introuvable"));

        Optional<ReadingProgress> existingProgress = readingProgressRepository.findByReaderAndBook(reader, book);

        if (existingProgress.isPresent()) {
            ReadingProgress progress = existingProgress.get();
            if (!Boolean.TRUE.equals(existingProgress.get().getIsOwned())) {
                progress.setIsOwned(true);
            }
        } else {
            ReadingProgress newProgress = readingProgressMapper.toNewEntity(reader, book);
            readingProgressRepository.save(newProgress);
        }

    }

    @Transactional
    public void removeBookFromBag(Long userId, Long bookId) {
        readingProgressRepository.findByReaderIdAndBookId(userId, bookId).ifPresent(progress -> {
            progress.setIsOwned(false);
        });
    }

    public List<BookResponseDTO> getMyBag(Long userId) {
        User reader = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé"));

        return readingProgressRepository.findByReaderAndIsOwnedTrue(reader).stream()
                .map(ReadingProgress::getBook)
                .map(bookMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<BookResponseDTO> getPublicLibraryBooks() {
        return bookRepository.findDistinctByCollectionsIsNotEmptyAndStatus(BookStatus.PUBLISHED).stream()
                .map(bookMapper::toResponse)
                .collect(Collectors.toList());
    }


}
