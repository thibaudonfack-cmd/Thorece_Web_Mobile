package cipestudio.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SEAWEEDFSConfig {
    @Value("${seaweedfs.bucket-name}")
    private String bucketName;

    @Value("${seaweedfs.endpoint}")
    private String endpoint;

    @Value("${seaweedfs.access-key}")
    private String accessKey;

    @Value("${seaweedfs.secret-key}")
    private String secretKey;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
            .endpoint(endpoint)
            .credentials(accessKey, secretKey).build();
    }

    @Bean
    public CommandLineRunner initMinioBucket(MinioClient minioClient){
        return args -> {
            try {
                boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
                if(!found){
                    minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
                    System.out.println("Bucket: "+bucketName+ " created successfully in " + endpoint);
                }else {
                    System.out.println("Bucket: "+bucketName+ " already exists");
                }
            }catch (Exception e){
                System.err.println("WARNING: MinIO initialization failed: " + e.getMessage());
            }
        };
    }
}
