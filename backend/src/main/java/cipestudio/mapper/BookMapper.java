package cipestudio.mapper;

import cipestudio.dto.book.BookRequestDTO;
import cipestudio.dto.book.BookResponseDTO;
import cipestudio.model.Book;
import cipestudio.model.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BookMapper {

    @Mapping(source = "author.id", target = "authorId")
    @Mapping(source = "author.nom", target = "authorName")
    BookResponseDTO toResponse(Book book);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "author", source = "author")
    @Mapping(target = "status", source = "request.status")
    @Mapping(target = "views", ignore = true)
    Book toEntity(BookRequestDTO request, User author);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBookFromDto(BookRequestDTO request, @MappingTarget Book book);
}