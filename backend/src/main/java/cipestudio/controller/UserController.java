package cipestudio.controller;

import cipestudio.dto.auth.*;
import cipestudio.dto.user.URLResponseDTO;
import cipestudio.dto.user.UpdateUserRequestDTO;
import cipestudio.model.RefreshToken;
import cipestudio.security.JwtUtils;
import cipestudio.security.UsersPrincipal;
import cipestudio.service.BookService;
import cipestudio.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.Map;


@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final BookService bookService;

    @Value("${jwt.cookie-secure}")
    private boolean isCookieSecure;

    @Value("${jwt.cookie-same-site}")
    private String cookieSameSite;

    @PostMapping("/auth/register")
    public UserDTO registerUser(@Valid @RequestBody RegistrationRequestDTO requestDTO) {
        return userService.registerUser(requestDTO);
    }

    @PostMapping("/auth/login")
    public UserDTO loginUser (@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        return userService.loginUser(loginRequestDTO);
    }

    @PostMapping("/auth/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO forgotPasswordRequestDTO) {
        userService.initiatePasswordReset(forgotPasswordRequestDTO);
        return ResponseEntity.ok("Password reset instructions have been sent to your email.");
    }
    
    @PostMapping("/auth/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO resetPasswordRequestDTO) {
        userService.resetPassword(resetPasswordRequestDTO);
        return ResponseEntity.ok("Votre mot de passe a été réinitialisé avec succès.");
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<Void> logoutUser() {
        userService.logoutUser();
        return ResponseEntity.noContent().build();
    }
    

    @PostMapping("/auth/verify-otp")
    public ResponseEntity<JwtResponseDTO> validationOtp(@Valid @RequestBody OtpValidationDTO otpvalidationdto) {
        RefreshToken refreshToken = userService.validateOtpCode(otpvalidationdto);
        String jwtToken = jwtUtils.generateToken(new UsersPrincipal(refreshToken.getUser()));
        ResponseCookie refreshTokenCookie = createResponseCookie(refreshToken.getToken(), otpvalidationdto.isStayConnected());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(new JwtResponseDTO(jwtToken));
    }

    
    @GetMapping("/users/me")
    public UserDTO getCurrentUser(Authentication authentication) {
        authentication = SecurityContextHolder.getContext().getAuthentication();
        return userService.getUser(Long.valueOf(authentication.getName()));

    }

    private ResponseCookie createResponseCookie(String refreshToken, boolean stayConnected) {
        long maxAge = stayConnected ? Duration.ofDays(30).toSeconds() : -1;
        return ResponseCookie.from("refresh_token",refreshToken)
                .httpOnly(true)
                .secure(isCookieSecure)
                .path("/refresh")
                .maxAge(maxAge)
                .sameSite(cookieSameSite)
                .build();
    }
    @PutMapping("/users/me")
    public UserDTO updateProfile(@Valid @RequestBody UpdateUserRequestDTO updateUserRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.valueOf(authentication.getName());
        return userService.updateUser(userId, updateUserRequestDTO);
    }

    @PostMapping(value = "/users/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = Long.valueOf(authentication.getName());
        URLResponseDTO urlResponseDTO = userService.updateAvatar(userId, file);

        return ResponseEntity.ok(Map.of("avatarUrl", urlResponseDTO.getUrl()));
    }
    @PostMapping(value = "/users/me/bag/{bookId}")
    public ResponseEntity<Void> addBookToBag(@PathVariable Long bookId){
        bookService.addBookToBag(Long.valueOf(SecurityContextHolder.getContext().getAuthentication().getName()), bookId);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/users/me/bag/{bookId}")
    public ResponseEntity<Void> removeBookFromBag(@PathVariable Long bookId){
        bookService.removeBookFromBag(Long.valueOf(SecurityContextHolder.getContext().getAuthentication().getName()), bookId);
        return ResponseEntity.ok().build();
    }
}