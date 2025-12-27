package cipestudio.repository;

import cipestudio.model.MiniGame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MiniGameRepository extends JpaRepository<MiniGame, Long> {
}
