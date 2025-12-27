package cipestudio.dto.auth;

import cipestudio.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String nom;
    private String email;
    private Role role;
    private String avatar;
    private Boolean isVerified;
    private Integer signalements;
}