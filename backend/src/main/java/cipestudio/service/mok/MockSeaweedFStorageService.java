package cipestudio.service.mok;

import cipestudio.service.SeaweedFStorageService;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@Profile("test")
@Primary
public class MockSeaweedFStorageService extends SeaweedFStorageService {
    @Override
    public String uploadFile(MultipartFile file) {
        String fakeFileName = UUID.randomUUID() + "_mock_" + file.getOriginalFilename();
        String fakeUrl = "http://localhost:9000/test-bucket/" + fakeFileName;
        System.out.println("TEST MODE: Simulation upload MinIO pour " + file.getOriginalFilename());
        return fakeUrl;
    }

    @Override
    public String uploadJson(Object content, String customName) {
        String fileName = (customName != null && !customName.isBlank())
                ? customName
                : UUID.randomUUID() + "_mock_story.json";
        String fakeUrl = "http://localhost:9000/test-bucket/" + fileName;
        System.out.println("TEST MODE: Simulation upload JSON MinIO pour " + fileName);
        return fakeUrl;
    }

    @Override
    public void deleteFile(String fileUrl) {
        System.out.println("TEST MODE: Simulation suppression fichier MinIO pour " + fileUrl);
    }
}
