FROM node:25-slim AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .

RUN npm run build

# Stage 2: Production
FROM nginx:stable-alpine AS production-stage
WORKDIR /usr/share/nginx/html

# Copie des fichiers compilés
COPY --from=build-stage /app/dist .

# Script pour générer config.js au démarrage
COPY <<EOF /docker-entrypoint.d/40-generate-config.sh
#!/bin/sh
cat <<EOC > /usr/share/nginx/html/config.js
window.config = {
  VUE_APP_API_BASE_URL: "\$VUE_APP_API_BASE_URL"
};
EOC
EOF

# Rendre le script exécutable
RUN chmod +x /docker-entrypoint.d/40-generate-config.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]