package cipestudio.dto.collection;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

import cipestudio.dto.book.BookResponseDTO;

@Data
@EqualsAndHashCode(callSuper = true)
public class CollectionDetailResponseDTO extends CollectionResponseDTO{
    private List<BookResponseDTO> books;
}
