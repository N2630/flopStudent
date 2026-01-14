# Stage 1: Build the Vue.js application
FROM node:25-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "80"]