package cipestudio.controller;

import cipestudio.dto.minigame.MiniGameRequestDTO;
import cipestudio.dto.minigame.MiniGameResponseDTO;
import cipestudio.service.MiniGameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/minigames")
@RequiredArgsConstructor
public class MiniGameController {

    private final MiniGameService miniGameService;

    @PostMapping("/create")
    public ResponseEntity<MiniGameResponseDTO> createMiniGame(@Valid @RequestBody MiniGameRequestDTO dto) {
        MiniGameResponseDTO createdGame = miniGameService.createMiniGame(dto);
        return ResponseEntity.ok(createdGame);
    }

    @org.springframework.web.bind.annotation.GetMapping("/{id}")
    public ResponseEntity<MiniGameResponseDTO> getMiniGame(@org.springframework.web.bind.annotation.PathVariable Long id) {
        return ResponseEntity.ok(miniGameService.getMiniGame(id));
    }

    @org.springframework.web.bind.annotation.PutMapping("/update/{id}")
    public ResponseEntity<MiniGameResponseDTO> updateMiniGame(@org.springframework.web.bind.annotation.PathVariable Long id, @Valid @RequestBody MiniGameRequestDTO dto) {
        return ResponseEntity.ok(miniGameService.updateMiniGame(id, dto));
    }
}
