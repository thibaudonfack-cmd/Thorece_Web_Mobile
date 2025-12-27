FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S java && adduser -S java -G java

COPY --chown=java:java backend/target/*.jar app.jar

USER java

ENTRYPOINT ["java", "-jar", "/app.jar"]