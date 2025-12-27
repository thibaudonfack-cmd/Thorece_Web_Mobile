package cipestudio.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class Page {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String draftUrl;
    private String publishedUrl;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    @PrePersist @PreUpdate
    public void onUpdate() {
        this.updateAt = LocalDateTime.now();
    }

}
