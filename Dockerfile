# NODE
FROM node:12-slim AS builder
WORKDIR /app
COPY package* ./
RUN npm ci
COPY . .
RUN npm run build && npm run export

# NGINX
FROM nginx:stable
COPY --from=builder /app/out /usr/share/nginx/html
