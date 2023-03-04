FROM maven:3.8.7-eclipse-temurin-19 AS build
ADD . /project
WORKDIR /project
RUN mvn -e package

FROM eclipse-temurin:latest
COPY --from=build /project/target/demo-1.0-SNAPSHOT-spring-boot.jar /app/Main.jar
ENTRYPOINT ["java","-jar","/app/Main.jar"]
