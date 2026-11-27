# Backend Dockerfile - Express.js + Prisma ORM + MySQL Client
FROM node:24-alpine

# Install openssl & netcat (untuk pengecekan database socket)
RUN apk add --no-cache openssl netcat-openbsd

WORKDIR /app

# Salin manifest dependensi
COPY package*.json ./
COPY prisma ./prisma/

# Install dependensi (termasuk Prisma CLI)
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Salin seluruh kode backend
COPY . .

# Buat direktori penyimpanan upload persisten
RUN mkdir -p uploads

# Siapkan entrypoint script (pastikan LF line endings agar aman dibangun dari Windows/Linux)
COPY docker-entrypoint.sh /usr/local/bin/
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"]
