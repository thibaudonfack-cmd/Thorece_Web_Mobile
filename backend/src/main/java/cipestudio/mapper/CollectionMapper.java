package cipestudio.mapper;

import cipestudio.dto.collection.CollectionDetailResponseDTO;
import cipestudio.dto.collection.CollectionRequestDTO;
import cipestudio.dto.collection.CollectionResponseDTO;
import cipestudio.model.Collection;
import cipestudio.model.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {BookMapper.class})
public interface CollectionMapper {
    @Mapping(target = "editorId", source = "editor.id")
    CollectionResponseDTO toResponse(Collection collection);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "editor", source = "editor")
    @Mapping(target = "coverUrl", ignore = true)
    @Mapping(target = "books", ignore = true)
    Collection toEntity(CollectionRequestDTO request, User editor);

    @Mapping(target = "editorId", source = "editor.id")
    @Mapping(target = "books", source = "books")
    CollectionDetailResponseDTO toDetailResponse(Collection collection);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "editor", ignore = true)
    @Mapping(target = "coverUrl", ignore = true)
    @Mapping(target = "books", ignore = true)
    @Mapping(target = "booksCount", ignore = true)
    void updateCollectionFromDto(CollectionRequestDTO request, @MappingTarget Collection collection);
}
