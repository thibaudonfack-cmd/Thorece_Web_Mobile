package cipestudio.dto.report;

import cipestudio.enums.ReportReason;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReportRequestDTO {
    @NotNull(message = "L'ID du livre est obligatoire")
    @Positive(message = "L'ID du livre doit être un nombre positif")
    private Long bookId;

    @NotNull(message = "Le motif est obligatoire")
    private ReportReason reason;

    @Size(max = 1000, message = "La description est trop longue")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-_.,!?'\"\\n\\ràéèêëîïôùûüÿæœçÀÉÈÊËÎÏÔÙÛÜŸÆŒÇ]*$",
            message = "La description contient des caractères non autorisés")
    private String description;

}
