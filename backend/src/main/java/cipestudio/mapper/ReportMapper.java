package cipestudio.mapper;

import cipestudio.dto.report.ReportRequestDTO;
import cipestudio.model.Book;
import cipestudio.model.Report;
import cipestudio.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReportMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "reporter", source = "reporter")
    @Mapping(target = "book", source = "book")
    @Mapping(target = "reason", source = "request.reason")
    @Mapping(target = "description", source = "request.description")
    Report toNewEntity(ReportRequestDTO request, User reporter, Book book);


}
