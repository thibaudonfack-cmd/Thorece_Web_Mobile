package cipestudio.service;

import cipestudio.dto.auth.UserDTO;
import cipestudio.exceptions.RefreshTokenNotFoundException;
import cipestudio.exceptions.RefreshTokenRevokedException;
import cipestudio.model.RefreshToken;
import cipestudio.model.User;
import cipestudio.repository.RefreshTokenRepository;
import cipestudio.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@AllArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    public RefreshToken createRefreshToken(UserDTO userDTO) {
        User user = userRepository.findById(userDTO.getId()).orElseThrow(
                () -> new RuntimeException("")
        );
        String token = UUID.randomUUID().toString();
        RefreshToken refreshToken = new RefreshToken(
                token,
                user,
                LocalDateTime.now().plusHours(24)
        );

        return refreshTokenRepository.save(refreshToken);
    }

    public User verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token).orElseThrow(
                () -> new RefreshTokenNotFoundException("")
        );
        if (LocalDateTime.now().isAfter(refreshToken.getExpiryDate()) || refreshToken.getIsRevoked()) {
            System.out.println(refreshToken.getExpiryDate());
            throw new RefreshTokenRevokedException("Token de rafraîchissement expiré ou révoqué. Veuillez vous reconnecter.");
        }
        return refreshToken.getUser();
    }

    public void deleteRefreshToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }
    public void deleteRefreshTokenByUser(User user) {
        refreshTokenRepository.deleteAllByUser(user);
    }

}