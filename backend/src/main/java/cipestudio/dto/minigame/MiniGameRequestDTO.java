package cipestudio.dto.minigame;

import cipestudio.enums.GameType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class MiniGameRequestDTO {
    @NotNull
    private GameType type;
    
    @NotNull
    private String contentJson; // Stores the solution/config

    @Positive
    private Integer xpReward;

    private String name;
    private String description;
}
