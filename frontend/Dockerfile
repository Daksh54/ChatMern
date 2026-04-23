FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/

RUN npm ci
RUN npm ci --prefix frontend

COPY frontend ./frontend

RUN npm run build --prefix frontend

FROM nginx:1.27-alpine

COPY infra/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80
