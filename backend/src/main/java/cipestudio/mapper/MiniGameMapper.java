package cipestudio.mapper;

import cipestudio.dto.minigame.MiniGameRequestDTO;
import cipestudio.dto.minigame.MiniGameResponseDTO;
import cipestudio.model.MiniGame;
import org.springframework.stereotype.Component;

@Component
public class MiniGameMapper {

    public MiniGame toEntity(MiniGameRequestDTO dto) {
        MiniGame entity = new MiniGame();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setType(dto.getType());
        entity.setContentJson(dto.getContentJson());
        if (dto.getXpReward() != null) {
            entity.setXpReward(dto.getXpReward());
        }
        return entity;
    }

    public MiniGameResponseDTO toDto(MiniGame entity) {
        MiniGameResponseDTO dto = new MiniGameResponseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setType(entity.getType());
        dto.setXpReward(entity.getXpReward());
        dto.setContentJson(entity.getContentJson());
        return dto;
    }
}
