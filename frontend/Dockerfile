# Frontend Dockerfile - Multi-Stage Build (Node 22 Alpine -> Nginx Alpine)

# Tahap 1: Kompilasi Aset Vue.js
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY . .
RUN npm run build

# Tahap 2: Penyajian Aset Statis via Nginx Alpine Super Ringan
FROM nginx:alpine

# Bersihkan direktori bawaan nginx
RUN rm -rf /usr/share/nginx/html/*

# Salin berkas hasil build dari builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Salin konfigurasi Nginx reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
