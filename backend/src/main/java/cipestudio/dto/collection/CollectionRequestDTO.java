package cipestudio.dto.collection;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CollectionRequestDTO {
    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 1, max = 100, message = "Le nom doit faire entre 1 et 100 caractères")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-_.,!?'\"àéèêëîïôùûüÿæœçÀÉÈÊËÎÏÔÙÛÜŸÆŒÇ]+$",
            message = "Le nom contient des caractères non autorisés")
    private String name;

    @Size(max = 1000, message = "La description ne peut pas dépasser 1000 caractères")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-_.,!?'\"\\n\\ràéèêëîïôùûüÿæœçÀÉÈÊËÎÏÔÙÛÜŸÆŒÇ]*$",
            message = "La description contient des caractères non autorisés")
    private String description;

    @Size(max = 255, message = "Les tags ne peuvent pas dépasser 255 caractères")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-_,#àéèêëîïôùûüÿæœçÀÉÈÊËÎÏÔÙÛÜŸÆŒÇ]*$",
            message = "Format des tags invalide (lettres, chiffres, # et virgules autorisés)")
    private String tags;

    @Size(max = 8, message = "L'icône doit être un emoji (max 8 caractères)")
    private String icon;
}
