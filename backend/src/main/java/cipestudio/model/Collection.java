package cipestudio.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Collection {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String coverUrl;
    private String tags;
    private String icon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User editor;

    @ManyToMany
    @JoinTable(
            name = "book_collection",
            joinColumns = @JoinColumn(name = "collection_id"),
            inverseJoinColumns = @JoinColumn(name = "book_id"))
    private List<Book> books = new ArrayList<>();
    @Formula("(SELECT COUNT(*) FROM book_collection bc WHERE bc.collection_id = id)")
    private Integer booksCount;

    public void addBook(Book book) {
        this.books.add(book);
        book.getCollections().add(this);
    }
    public void removeBook(Book book) {
        this.books.remove(book);
        book.getCollections().remove(this);
    }
}
