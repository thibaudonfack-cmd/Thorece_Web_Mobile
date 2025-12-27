package cipestudio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import cipestudio.model.RefreshToken;
import cipestudio.model.User;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface RefreshTokenRepository  extends JpaRepository <RefreshToken , Long>{
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUser(User user);
    void deleteByToken(String refreshToken);

    @Transactional 
    void deleteAllByUser(User user);
    void deleteByUserId(long long1);
}
