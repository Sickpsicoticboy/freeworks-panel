# ===== Etapa 1: compilar Angular =====
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod

# ===== Etapa 2: servir con nginx =====
FROM nginx:alpine
# El builder "application" de Angular 17 deja el sitio en dist/<app>/browser
COPY --from=build /app/dist/freeworks-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
