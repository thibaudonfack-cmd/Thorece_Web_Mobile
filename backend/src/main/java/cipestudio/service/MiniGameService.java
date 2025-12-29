package cipestudio.service;

import cipestudio.dto.minigame.MiniGameRequestDTO;
import cipestudio.dto.minigame.MiniGameResponseDTO;
import cipestudio.mapper.MiniGameMapper;
import cipestudio.model.MiniGame;
import cipestudio.repository.MiniGameRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
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
        log.info("Fetching MiniGame with ID: {}", id);

        if (id == null) {
            log.error("MiniGame ID is null");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "MiniGame ID cannot be null");
        }

        MiniGame miniGame = miniGameRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("MiniGame not found with ID: {}", id);
                    return new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "MiniGame not found with ID: " + id
                    );
                });

        log.info("MiniGame found: {} (Type: {})", miniGame.getName(), miniGame.getType());
        return miniGameMapper.toDto(miniGame);
    }

    @Transactional
    public MiniGameResponseDTO updateMiniGame(Long id, MiniGameRequestDTO dto) {
        log.info("Updating MiniGame with ID: {}", id);

        MiniGame miniGame = miniGameRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("MiniGame not found for update with ID: {}", id);
                    return new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "MiniGame not found with ID: " + id
                    );
                });

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
