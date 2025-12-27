    package cipestudio.dto.collection;

    import lombok.Data;

    @Data
    public class CollectionResponseDTO {
        private Long id;
        private String name;
        private String description;
        private String coverUrl;
        private String tags;
        private String icon;
        private Integer booksCount;
        private Long editorId;
    }
