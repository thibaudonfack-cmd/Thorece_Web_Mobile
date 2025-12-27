package cipestudio.model;

import cipestudio.enums.BookStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Book {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    @Column(length = 10000)
    private String description;
    private String coverUrl;

    @Enumerated(EnumType.STRING)
    private BookStatus status = BookStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    @ManyToMany(mappedBy = "books")
    private List<Collection> collections = new ArrayList<>();

    @OneToOne(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    private Page pages;
    @Formula( "(SELECT COUNT(*) FROM reading_progress rp WHERE rp.book_id = id)")
    private Integer views = 0;

    @Formula("(SELECT COUNT(*) FROM report r WHERE r.book_id = id)")
    private Integer reportsCount = 0;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt = LocalDateTime.now();

}
