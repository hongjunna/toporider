#!/bin/bash

# 에러 발생 시 중단
set -e

echo "🚀 TopoRider 배포 시작..."

# 1. 최신 코드 받기
echo "📥 Git Pull..."
git pull origin main

# 2. 환경 변수 파일 확인 (없으면 생성하라는 경고)
if [ ! -f .env ]; then
  echo "⚠️  .env 파일이 없습니다! DB_PASSWORD 등을 설정해주세요."
  exit 1
fi

# 3. Docker Compose 재실행 (빌드 포함)
echo "🐳 Docker Compose Build & Up..."
# 캐시를 사용하되 최신 변경사항 빌드
docker-compose up -d --build

# 4. 불필요한 이미지 정리 (용량 확보)
echo "🧹 Pruning unused images..."
docker image prune -f

echo "✅ 배포 완료! TopoRider가 성공적으로 업데이트되었습니다."