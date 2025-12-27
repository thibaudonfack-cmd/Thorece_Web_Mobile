package cipestudio.dto.page;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BookContentResponseDTO {
    private String s3OriginalUrl;
    private LocalDateTime updateAt;
}
