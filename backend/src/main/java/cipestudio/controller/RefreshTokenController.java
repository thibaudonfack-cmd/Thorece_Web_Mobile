package cipestudio.controller;

import cipestudio.dto.auth.JwtResponseDTO;
import cipestudio.model.User;
import cipestudio.security.JwtUtils;
import cipestudio.security.UsersPrincipal;
import cipestudio.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RefreshTokenController {
    private final RefreshTokenService refreshTokenService;
    private final JwtUtils jwtUtils;
    @PostMapping("/refresh")
    public ResponseEntity<JwtResponseDTO> refreshToken(@CookieValue(name = "refresh_token", required = false) String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        User user = refreshTokenService.verifyRefreshToken(refreshToken);
        return  ResponseEntity.ok(new JwtResponseDTO(jwtUtils.generateToken(new UsersPrincipal(user))));
    }
}
