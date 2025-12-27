package cipestudio.service;

import cipestudio.dto.auth.RegistrationRequestDTO;
import cipestudio.dto.auth.UserDTO;
import cipestudio.enums.Role;
import cipestudio.mapper.UserMapper;
import cipestudio.model.User;
import cipestudio.repository.RefreshTokenRepository;
import cipestudio.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private UserMapper userMapper;
    @Mock private EmailService emailService;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private RefreshTokenService refreshTokenService;
    @Mock private Environment env;
    @Mock private SeaweedFStorageService seaweedFSStorageService;

    @InjectMocks
    private UserService userService;

    @Test
    void registerUser_ShouldAutoVerifyChild() {
        // Arrange
        RegistrationRequestDTO request = new RegistrationRequestDTO();
        request.setEmail("child@test.com");
        request.setPassword("password");

        User userEntity = new User();
        userEntity.setEmail("child@test.com");
        userEntity.setRole(Role.ENFANT);
        userEntity.setIsVerified(false); // Initially false

        when(userRepository.findByEmail("child@test.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("encoded");
        when(userMapper.toEntity(request)).thenReturn(userEntity);
        
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userMapper.toDto(any(User.class))).thenReturn(new UserDTO());
        when(env.getActiveProfiles()).thenReturn(new String[]{});

        // Act
        userService.registerUser(request);

        // Assert
        assertTrue(userEntity.getIsVerified(), "Child user should be automatically verified");
        verify(userRepository, atLeastOnce()).save(userEntity);
    }
    
    @Test
    void registerUser_ShouldNotVerifyOthers() {
        // Arrange
        RegistrationRequestDTO request = new RegistrationRequestDTO();
        request.setEmail("adult@test.com");
        request.setPassword("password");

        User userEntity = new User();
        userEntity.setEmail("adult@test.com");
        userEntity.setRole(Role.EDITEUR);
        userEntity.setIsVerified(false); 

        when(userRepository.findByEmail("adult@test.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("encoded");
        when(userMapper.toEntity(request)).thenReturn(userEntity);
        
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userMapper.toDto(any(User.class))).thenReturn(new UserDTO());
        when(env.getActiveProfiles()).thenReturn(new String[]{});

        // Act
        userService.registerUser(request);

        // Assert
        assertFalse(userEntity.getIsVerified(), "Editor user should NOT be automatically verified");
        verify(userRepository, atLeastOnce()).save(userEntity);
    }
}
