package cipestudio.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.minio.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.UUID;

@Service
public class SeaweedFStorageService {
    @Autowired
    private MinioClient minioClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${seaweedfs.bucket-name:avatars}")
    private String bucketName;

    @Value("${seaweedfs.public-url}")
    private String publicUrl;

    public String uploadJson(Object content) {
        return uploadJson(content, null);
    }

    public String uploadJson(Object content, String customName) {
        try {
            String jsonString = objectMapper.writeValueAsString(content);
            byte[] contentBytes = jsonString.getBytes(StandardCharsets.UTF_8);
            InputStream inputStream = new ByteArrayInputStream(contentBytes);
            
            String fileName = (customName != null && !customName.isBlank()) 
                ? customName 
                : UUID.randomUUID() + "_story.json";

            minioClient.putObject(
                PutObjectArgs.builder()
                .bucket(bucketName)
                .object(fileName)
                .stream(inputStream, contentBytes.length, -1)
                .contentType("application/json")
                .build());
            
            return publicUrl + "/" + bucketName + "/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'upload JSON MinIO: " + e.getMessage());
        }
    }

    public String uploadFile(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
        String fileName = UUID.randomUUID() + "_" + Objects.requireNonNull(file.getOriginalFilename()).replace(" ", "_");
        minioClient.putObject(
            PutObjectArgs.builder()
            .bucket(bucketName)
            .object(fileName)
            .stream(inputStream, file.getSize(),-1)
            .contentType(file.getContentType())
            .build());
        return publicUrl + "/" + bucketName + "/" + fileName;
    }catch (Exception e){
        throw new RuntimeException("Erreur lors de l'upload MinIO: " + e.getMessage());}
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()){
            return;
        }
        try {
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .build()

            );
            System.out.println("Fichier supprimé de Minio: " + fileName);
        }catch (Exception e){
            System.err.println("Impossible de supprimer le fichier: " + e.getMessage());
        }
    }



}
