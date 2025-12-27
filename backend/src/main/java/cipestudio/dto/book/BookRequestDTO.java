package cipestudio.dto.book;

import cipestudio.enums.BookStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookRequestDTO {
    
    @Size(min = 1, max = 255, message = "Le titre doit contenir entre 1 et 255 caractères")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-_.,!?'\"àéèêëîïôùûüÿæœçÀÉÈÊËÎÏÔÙÛÜŸÆŒÇ]+$", 
             message = "Le titre contient des caractères non autorisés")
    private String title;
    
    @Size(max = 10000, message = "La description ne peut pas dépasser 10000 caractères")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-_.,!?'\"\\n\\ràéèêëîïôùûüÿæœçÀÉÈÊËÎÏÔÙÛÜŸÆŒÇ]*$",
             message = "La description contient des caractères non autorisés")
    private String description;
    
    private BookStatus status;
}