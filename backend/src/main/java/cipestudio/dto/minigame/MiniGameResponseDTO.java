package cipestudio.dto.minigame;

import cipestudio.enums.GameType;
import lombok.Data;

@Data
public class MiniGameResponseDTO {
    private Long id;
    private String name;
    private GameType type;
    private Integer xpReward;
    private String contentJson;
}
