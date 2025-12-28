package cipestudio.service;

import cipestudio.dto.minigame.MiniGameRequestDTO;
import cipestudio.dto.minigame.MiniGameResponseDTO;
import cipestudio.mapper.MiniGameMapper;
import cipestudio.model.MiniGame;
import cipestudio.repository.MiniGameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MiniGameService {

    private final MiniGameRepository miniGameRepository;
    private final MiniGameMapper miniGameMapper;

    @Transactional
    public MiniGameResponseDTO createMiniGame(MiniGameRequestDTO dto) {
        MiniGame miniGame = miniGameMapper.toEntity(dto);
        MiniGame savedGame = miniGameRepository.save(miniGame);
        return miniGameMapper.toDto(savedGame);
    }

    public MiniGameResponseDTO getMiniGame(Long id) {
        MiniGame miniGame = miniGameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MiniGame not found"));
        return miniGameMapper.toDto(miniGame);
    }

    @Transactional
    public MiniGameResponseDTO updateMiniGame(Long id, MiniGameRequestDTO dto) {
        MiniGame miniGame = miniGameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MiniGame not found"));

        miniGame.setName(dto.getName());
        miniGame.setDescription(dto.getDescription());
        miniGame.setType(dto.getType());
        miniGame.setContentJson(dto.getContentJson());
        if (dto.getXpReward() != null) {
            miniGame.setXpReward(dto.getXpReward());
        }
        miniGame.setSuccessPageNumber(dto.getSuccessPageNumber());
        miniGame.setFailurePageNumber(dto.getFailurePageNumber());

        MiniGame savedGame = miniGameRepository.save(miniGame);
        return miniGameMapper.toDto(savedGame);
    }
}
