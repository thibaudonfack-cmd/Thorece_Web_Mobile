package cipestudio.service;

import cipestudio.dto.auth.UserDTO;
import cipestudio.exceptions.RefreshTokenNotFoundException;
import cipestudio.exceptions.RefreshTokenRevokedException;
import cipestudio.model.RefreshToken;
import cipestudio.model.User;
import cipestudio.repository.RefreshTokenRepository;
import cipestudio.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    @Test
    void createRefreshToken_ShouldGenerateToken() {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(1L);
        User user = new User();
        user.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RefreshToken result = refreshTokenService.createRefreshToken(userDTO);

        assertNotNull(result.getToken());
        assertEquals(user, result.getUser());
        assertTrue(result.getExpiryDate().isAfter(LocalDateTime.now()));
    }

    @Test
    void verifyRefreshToken_ShouldReturnUser_WhenTokenValid() {
        String tokenStr = "valid-token";
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(tokenStr);
        refreshToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        refreshToken.setIsRevoked(false);
        refreshToken.setUser(new User());

        when(refreshTokenRepository.findByToken(tokenStr)).thenReturn(Optional.of(refreshToken));

        User resultUser = refreshTokenService.verifyRefreshToken(tokenStr);

        assertNotNull(resultUser);
    }

    @Test
    void verifyRefreshToken_ShouldThrow_WhenTokenExpired() {
        String tokenStr = "expired-token";
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setExpiryDate(LocalDateTime.now().minusHours(1));
        refreshToken.setIsRevoked(false);

        when(refreshTokenRepository.findByToken(tokenStr)).thenReturn(Optional.of(refreshToken));

        assertThrows(RefreshTokenRevokedException.class, () -> refreshTokenService.verifyRefreshToken(tokenStr));
    }

    @Test
    void verifyRefreshToken_ShouldThrow_WhenTokenRevoked() {
        String tokenStr = "revoked-token";
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        refreshToken.setIsRevoked(true);

        when(refreshTokenRepository.findByToken(tokenStr)).thenReturn(Optional.of(refreshToken));

        assertThrows(RefreshTokenRevokedException.class, () -> refreshTokenService.verifyRefreshToken(tokenStr));
    }

    @Test
    void verifyRefreshToken_ShouldThrow_WhenTokenUnknown() {
        when(refreshTokenRepository.findByToken("hacker-token")).thenReturn(Optional.empty());

        assertThrows(RefreshTokenNotFoundException.class, () -> refreshTokenService.verifyRefreshToken("hacker-token"));
    }
}