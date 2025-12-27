package cipestudio.mapper;

import cipestudio.dto.auth.RegistrationRequestDTO;
import cipestudio.dto.auth.UserDTO;
import cipestudio.model.User;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring") // Tells MapStruct to create a Spring Bean
public interface UserMapper {

    UserDTO toDto(User user);
    User toEntity(RegistrationRequestDTO registrationRequestDTO);
    

}