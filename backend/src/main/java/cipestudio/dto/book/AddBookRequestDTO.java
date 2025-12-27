package cipestudio.dto.book;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class AddBookRequestDTO {
    @NotNull(message = "L'ID du livre est obligatoire")
    @Positive(message = "L'ID du livre doit être un nombre positif")
    private Long bookId;
}
