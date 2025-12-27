
package cipestudio.service;

import cipestudio.dto.auth.*;
import cipestudio.dto.user.URLResponseDTO;
import cipestudio.dto.user.UpdateUserRequestDTO;
import cipestudio.exceptions.EmailAlreadyExistsException;
import cipestudio.mapper.UserMapper;
import cipestudio.model.RefreshToken;
import cipestudio.model.User;
import cipestudio.repository.RefreshTokenRepository;
import cipestudio.repository.UserRepository;
import lombok.RequiredArgsConstructor;


import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final EmailService emailService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RefreshTokenService refreshTokenService;
    private final Environment env;
    private final SeaweedFStorageService seaweedFSStorageService;

    @Transactional
    public UserDTO registerUser(RegistrationRequestDTO registrationRequest) {
        Optional<User> user = userRepository.findByEmail(registrationRequest.getEmail());
        if(user.isPresent()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad Request");
        }

        registrationRequest.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
        
        User newUserEntity = userMapper.toEntity(registrationRequest);
        
        if (newUserEntity.getRole() == cipestudio.enums.Role.ENFANT) {
            newUserEntity.setIsVerified(true);
        }
        
        User savedUser = userRepository.save(newUserEntity);
        
        UserDTO newUser = userMapper.toDto(savedUser);
        generateAndSendOtpCode(savedUser);
        return newUser;

    }

    @Transactional
    public UserDTO loginUser(LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides"));

        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides");
        }

        generateAndSendOtpCode(user);
        return userMapper.toDto(user);
    }

    @Transactional
    public RefreshToken validateOtpCode(OtpValidationDTO otpvalidationdto){
        User user = userRepository.findByEmail(otpvalidationdto.getEmail()).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad Request")
        );
        validateOtp(user, otpvalidationdto.getOtpCode());

        user.setDerniereConnexion(LocalDateTime.now());
        user.setOtpCode(null);
        user.setOtpExpirationDate(null);
        UserDTO userDTO = userMapper.toDto(userRepository.save(user));

        refreshTokenRepository.findByUser(user).ifPresent(tokenEntity -> {
            refreshTokenRepository.delete(tokenEntity);
            refreshTokenRepository.flush();
        });

        return refreshTokenService.createRefreshToken(userDTO);
    }
    public UserDTO getUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () ->  new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad Request")
        );
        return userMapper.toDto(user);
    }

    public void initiatePasswordReset(ForgotPasswordRequestDTO forgotPasswordRequestDTO) {
        userRepository.findByEmail(forgotPasswordRequestDTO.getEmail()).ifPresent(this::generateAndSendOtpCode);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequestDTO resetPasswordRequestDTO) {
        User user = userRepository.findByEmail(resetPasswordRequestDTO.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé"));

        validateOtp(user, resetPasswordRequestDTO.getOtpCode());
        user.setPassword(passwordEncoder.encode(resetPasswordRequestDTO.getNewPassword()));

        user.setOtpCode(null);
        user.setOtpExpirationDate(null);

        userRepository.save(user);
    }

    @Transactional
    public void logoutUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null 
            || !authentication.isAuthenticated() 
            || "anonymousUser".equals(authentication.getPrincipal())) {
            return;
        }
        refreshTokenRepository.deleteByUserId(Long.parseLong(authentication.getName()));
    }

    private void validateOtp(User user, String otpCode) {
        if (user.getOtpCode() == null
                || user.getOtpExpirationDate() == null
                || !user.getOtpCode().equals(otpCode)
                || LocalDateTime.now().isAfter(user.getOtpExpirationDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Code invalide ou expiré.");
        }
    }


    private void generateAndSendOtpCode(User user){
        String otpCode;
        String[] activeProfiles = env.getActiveProfiles();
        boolean isTestProfile = false;
        for  (String profile : activeProfiles) {
            if ("test".equals(profile)) {
                isTestProfile = true;
                break;
            }
        }
        if (isTestProfile) {
            // MODE TEST : OTPCODE = "OOOOOO"
            otpCode = "000000";
            System.out.println("ATTENTION MODE TEST ACTIVÉ : Magic OTP généré pour "+ user.getEmail()+ " : "+ otpCode);
        }else {
            SecureRandom random = new SecureRandom();
            int code = random.nextInt(1000000);
            otpCode = String.format("%06d", code);
        }

        user.setOtpCode(otpCode);
        user.setOtpExpirationDate(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        emailService.sendEmail(
                user.getEmail(),
                "Code de validation",
                "Bonjour "+user.getNom()+" ! Votre code de validation pour agapp.be est : "+ otpCode + ". Il est valide 5 minutes.");
    }


    public void sendEditorVerificationEmail(final String email) {
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found")
        );

        if (!user.getRole().equals(cipestudio.enums.Role.EDITEUR)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not an editor");
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm");
        String emailSubject = "Statut de validation de votre compte - Cipe Studio";
        String emailBody;

        if (user.getIsVerified() != null && user.getIsVerified()) {
            emailBody = "Bonjour " + user.getNom() + ",\n\n" +
                    "Excellente nouvelle! Votre compte a été vérifié par notre équipe d'administration.\n\n" +
                    "Vous pouvez maintenant accéder à toutes les fonctionnalités de Cipe Studio.\n\n" +
                    "Date de vérification: " + LocalDateTime.now().format(formatter) + "\n\n" +
                    "Si vous avez des questions, n'hésitez pas à nous contacter.\n\n" +
                    "Cordialement,\n" +
                    "L'équipe Cipe Studio";
        } else {
            emailBody = "Bonjour " + user.getNom() + ",\n\n" +
                    "Merci de vous être inscrit en tant qu'éditeur sur Cipe Studio.\n\n" +
                    "Votre compte est actuellement en attente de validation par notre équipe d'administration.\n\n" +
                    "Cette vérification nous permet de garantir la qualité et la sécurité de notre plateforme.\n\n" +
                    "Vous serez notifié par email dès que votre compte aura été approuvé.\n\n" +
                    "Date de demande: " + LocalDateTime.now().format(formatter) + "\n\n" +
                    "Merci pour votre patience.\n\n" +
                    "Cordialement,\n" +
                    "L'équipe Cipe Studio";
        }

        emailService.sendEmail(email, emailSubject, emailBody);
    }

    @Transactional
    public UserDTO updateUser(Long userId, UpdateUserRequestDTO updateUserRequestDTO) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found")
        );
        if (updateUserRequestDTO.getNom() != null && !updateUserRequestDTO.getNom().isBlank()) {
            user.setNom(updateUserRequestDTO.getNom());
        }
        if(updateUserRequestDTO.getEmail() != null && !updateUserRequestDTO.getEmail().isBlank() && !updateUserRequestDTO.getEmail().equals(user.getEmail())) {
            if(userRepository.existsByEmail(updateUserRequestDTO.getEmail())) {
                throw new EmailAlreadyExistsException("Cet email existente déjà");
            }
            user.setEmail(updateUserRequestDTO.getEmail());
        }
        if(updateUserRequestDTO.getNewPassword() != null && !updateUserRequestDTO.getNewPassword().isBlank()) {
            if(updateUserRequestDTO.getCurrentPassword() == null || !passwordEncoder.matches(updateUserRequestDTO.getCurrentPassword(), user.getPassword())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password incorrecte");
            }
            user.setPassword(passwordEncoder.encode(updateUserRequestDTO.getNewPassword()));
        }
        return userMapper.toDto(userRepository.save(user));
    }
    @Transactional
    public URLResponseDTO updateAvatar(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found")
        );
        if(user.getAvatar() != null && !user.getAvatar().isBlank()) {
            seaweedFSStorageService.deleteFile(user.getAvatar());
        }
        URLResponseDTO avatarUrl = new URLResponseDTO(seaweedFSStorageService.uploadFile(file));
        user.setAvatar(avatarUrl.getUrl());
        userRepository.save(user);
        return avatarUrl;
    }

    @Transactional
    public void addXp(Long userId, int amount) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found")
        );
        user.setXp((user.getXp() == null ? 0 : user.getXp()) + amount);
        userRepository.save(user);
    }
}
