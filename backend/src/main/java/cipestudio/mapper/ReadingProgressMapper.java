package cipestudio.mapper;

import cipestudio.model.Book;
import cipestudio.model.ReadingProgress;
import cipestudio.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReadingProgressMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reader", source = "reader")
    @Mapping(target = "book", source = "book")
    @Mapping(target = "isOwned", constant = "true")
    @Mapping(target = "isRead", constant = "false")
    @Mapping(target = "currentPage", constant = "1")
    @Mapping(target = "lastReadAt", expression = "java(java.time.LocalDateTime.now())")
    ReadingProgress toNewEntity(User reader, Book book);
}
