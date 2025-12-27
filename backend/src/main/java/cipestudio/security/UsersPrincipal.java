package cipestudio.security;

import cipestudio.model.User;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@AllArgsConstructor
public class UsersPrincipal implements UserDetails {
    private User users;

    @Override
    public String getUsername(){
        return String.valueOf(users.getId());
    }
    @Override
    public String getPassword(){
        return users.getPassword();
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + users.getRole()));

    }
}
