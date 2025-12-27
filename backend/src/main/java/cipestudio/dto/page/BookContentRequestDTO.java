package cipestudio.dto.page;

import cipestudio.enums.BookStatus;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class BookContentRequestDTO {
    @Pattern(regexp = "^((?!<script|javascript:|\\bon(load|click|mouse|key|error|abort|blur|change|focus|reset|submit|unload)[a-z]*\\s*=|<iframe|<object|<embed).)*$", 
             flags = {Pattern.Flag.CASE_INSENSITIVE, Pattern.Flag.DOTALL},
             message = "Le contenu du livre contient du code non autorisé")
    private String bookContent;

    private BookStatus bookStatus;
}