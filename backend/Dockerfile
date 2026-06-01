## Multi-stage Dockerfile
## Stage 1: build using a JDK 25 base and the project's Maven wrapper (mvnw)
## Stage 2: run the resulting fat jar on a smaller JRE image

### NOTE
### This Dockerfile assumes you want to build and run with Java 25.
### If the chosen image tags aren't available in your registry, change them
### to a matching Temurin/OpenJDK 25 tag that exists in your environment.

FROM eclipse-temurin:25-jdk AS build

WORKDIR /app

# Copy only files needed to download dependencies first (speeds up rebuilds)
COPY pom.xml mvnw .
COPY .mvn .mvn

RUN chmod +x mvnw

# Download dependencies (wrapper will download Maven if necessary)
RUN ./mvnw -B -DskipTests dependency:go-offline

# Copy the source and build the application
COPY src ./src
COPY pom.xml ./
RUN ./mvnw -B -DskipTests package

### Runtime image usando JRE (ainda menor e mais segura para producão)
FROM eclipse-temurin:25-jdk AS runtime

WORKDIR /app

EXPOSE 8080

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]