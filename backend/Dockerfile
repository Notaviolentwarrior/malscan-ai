FROM maven:3.9.11-eclipse-temurin-21 AS build

WORKDIR /build

COPY pom.xml .
COPY src ./src

RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /build/target/*.jar /app/app.jar

RUN mkdir -p /opt/malscan/uploads/quarantine

ENV SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/malscan_ai
ENV APP_ANALYZER_BASE_URL=http://analyzer:8000
ENV APP_UPLOAD_DIR=/opt/malscan/uploads/quarantine

EXPOSE 8080

CMD ["java", "-jar", "/app/app.jar"]
