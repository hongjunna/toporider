# 1. Java 환경 설정
FROM eclipse-temurin:17-jre

# 2. 작업 디렉토리 생성
WORKDIR /graphhopper

# 3. GraphHopper 실행 파일(JAR) 다운로드
# (버전은 최신 안정화 버전인 9.x 혹은 10.x 기준)
ADD https://repo1.maven.org/maven2/com/graphhopper/graphhopper-web/9.1/graphhopper-web-9.1.jar graphhopper.jar

# 4. 설정 파일과 데이터가 들어올 볼륨 설정
VOLUME ["/data"]

# 5. 실행 명령 (config.yml 경로와 osm 파일 경로는 docker-compose에서 지정)
ENTRYPOINT ["java", "-Xmx2g", "-Xms2g", "-jar", "graphhopper.jar", "server", "/graphhopper/config.yml"]