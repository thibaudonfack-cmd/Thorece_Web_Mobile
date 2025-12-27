package cipestudio.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OtpValidationDTO {
    @NotBlank(message = "L'email ne peut pas être vide")
    @Email(message = "Format de l'email invalide")
    @Size(max = 100, message = "L'email est trop long")
    private String email;

    @NotBlank(message = "Le code OTP ne peut pas être vide")
    @Pattern(regexp = "^\\d{6}$", message = "Le code OTP doit contenir exactement 6 chiffres")
    private String otpCode;

    private boolean stayConnected = false;

}
