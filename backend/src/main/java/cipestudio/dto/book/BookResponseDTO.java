package cipestudio.dto.book;

import cipestudio.enums.BookStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookResponseDTO {
    
    private Long id;
    private String title;
    private String description;
    private String coverUrl;
    private BookStatus status;
    
    private Long authorId;
    private String authorName;
    
    private Integer views;
    private Integer reportsCount;
    private LocalDateTime createdAt;
}