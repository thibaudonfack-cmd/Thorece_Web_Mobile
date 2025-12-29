package cipestudio.controller;

import cipestudio.dto.user.URLResponseDTO;
import cipestudio.dto.minigame.MiniGameRequestDTO;
import cipestudio.dto.minigame.MiniGameResponseDTO;
import cipestudio.service.MiniGameService;
import cipestudio.service.SeaweedFStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/minigames")
@RequiredArgsConstructor
public class MiniGameController {

    private final MiniGameService miniGameService;
    private final SeaweedFStorageService storageService;

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

    @PostMapping(value = "/upload-puzzle-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<URLResponseDTO> uploadPuzzleImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = storageService.uploadFile(file);
        return ResponseEntity.ok(new URLResponseDTO(imageUrl));
    }
}
