package cipestudio.security;

import cipestudio.model.User;
import cipestudio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsersDetailsService {
    @Autowired
    private UserRepository userRepository;

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Long userId = Long.valueOf(username);
        User user = userRepository.findById(userId).orElseThrow(
                () -> new UsernameNotFoundException("User not found"));
        return new UsersPrincipal(user);
    }
}
