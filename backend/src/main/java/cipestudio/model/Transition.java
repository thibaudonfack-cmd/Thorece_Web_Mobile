package cipestudio.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Transition {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String text;

    @ManyToOne
    @JoinColumn(name = "source_page_id")
    private Page sourcePage;

    @ManyToOne
    @JoinColumn(name = "target_page_id")
    private Page targetPage;
}
