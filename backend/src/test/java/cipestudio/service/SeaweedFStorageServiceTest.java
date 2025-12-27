package cipestudio.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SeaweedFStorageServiceTest {

    @Mock
    private MinioClient minioClient;

    @InjectMocks
    private SeaweedFStorageService seaweedFSStorageService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(Objects.requireNonNull(seaweedFSStorageService), "bucketName", "test-bucket");
        ReflectionTestUtils.setField(Objects.requireNonNull(seaweedFSStorageService), "publicUrl", "http://localhost:9000");
    }

    @Test
    void uploadFile_ShouldReturnUrl_WhenUploadIsSuccessful() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "avatar.jpg",
                "image/jpeg",
                "contenu_image_test".getBytes()
        );

        // ACT
        String resultUrl = seaweedFSStorageService.uploadFile(file);

        // ASSERT
        // 1. Vérifier que l'URL retournée est correcte
        assertNotNull(resultUrl);
        assertTrue(resultUrl.startsWith("http://localhost:9000/test-bucket/"));
        assertTrue(resultUrl.endsWith("_avatar.jpg")); // Vérifie que le nom d'origine est préservé à la fin

        // 2. Vérifier que la méthode putObject de MinIO a bien été appelée avec les bons arguments
        ArgumentCaptor<PutObjectArgs> captor = ArgumentCaptor.forClass(PutObjectArgs.class);
        verify(minioClient).putObject(captor.capture());

        PutObjectArgs args = captor.getValue();
        assertEquals("test-bucket", args.bucket());
        assertEquals("image/jpeg", args.contentType());
        assertEquals(file.getSize(), args.objectSize());
    }

    @Test
    void uploadFile_ShouldThrowException_WhenMinioFails() throws Exception {
        // ARRANGE
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "content".getBytes());

        // On simule une erreur lors de l'appel à MinIO
        when(minioClient.putObject(any(PutObjectArgs.class)))
                .thenThrow(new RuntimeException("MinIO Connection Error"));

        // ACT & ASSERT
        Exception exception = assertThrows(RuntimeException.class, () -> {
            seaweedFSStorageService.uploadFile(file);
        });

        assertTrue(exception.getMessage().contains("Erreur lors de l'upload MinIO"));
    }
}
