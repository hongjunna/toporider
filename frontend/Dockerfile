# 1. 빌드 단계
FROM node:18-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# .env 파일이 있다면 빌드 시점에 포함 (API 주소 등)
# RUN echo "VITE_API_URL=/api" > .env
RUN npm run build

# 2. 실행 단계 (Nginx)
FROM nginx:alpine
# 빌드된 결과물을 Nginx 폴더로 복사
COPY --from=build /app/dist /usr/share/nginx/html
# React Router 새로고침 시 404 방지 설정
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]