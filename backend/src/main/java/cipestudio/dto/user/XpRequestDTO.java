package cipestudio.dto.user;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class XpRequestDTO {
    @NotNull
    @Positive
    private Integer amount;
}
