package cipestudio.model;


import cipestudio.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String avatar;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private LocalDateTime dateInscription;

    private Boolean isVerified = false;

    private Boolean isBlocked = false;

    @Formula("(SELECT COUNT(r.id) FROM report r JOIN book b ON r.book_id = b.id WHERE b.author_id = id)")
    private Integer signalements = 0;

    private LocalDateTime derniereConnexion;

    private String otpCode;

    @OneToMany(mappedBy = "author")
    private List<Book> authoredBooks;

    @OneToMany(mappedBy = "editor")
    private List<Collection> managedCollections;

    @OneToMany(mappedBy = "reader")
    private List<ReadingProgress> library;

    private LocalDateTime otpExpirationDate;

    @PrePersist
    protected void onCreate() {
        dateInscription = LocalDateTime.now();
    }

    public void addAuthoredBook(Book book) {
        this.authoredBooks.add(book);
        book.setAuthor(this);
    }

    public void removeAuthoredBook(Book book) {
        this.authoredBooks.remove(book);
        book.setAuthor(null);
    }


}