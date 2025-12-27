package cipestudio.model;

import cipestudio.enums.GameType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class MiniGame {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @Column(length = 500)
    private String introText;

    @Enumerated(EnumType.STRING)
    private GameType type;

    @Column(columnDefinition = "TEXT")
    private String contentJson;

    @OneToOne
    @JoinColumn(name = "page_id")
    private Page parentPage;

    private Integer successPageNumber;
    private Integer failurePageNumber;

}
