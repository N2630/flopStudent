## FlopStudent

FlopStudent est une application web open source alternative à [flop!EDT]("https://www.flopedt.org/"). Elle permet aux étudiants de consulter leur emplois du temps (EDT) et les salles libres de l’IUT avec une interface plus intuitive et facile d'utilisation (notamment sur mobile). Le projet s’inspire ainsi de flop!EDT en ajoutant une expérience optimisée (mobile-friendly, mode hors-ligne, salles libres, et d'autres fonctionnalitées à l'avenir).

![Logo FlopStudent](./frontend/src/assets/logo.png "Logo FlopStudent")

### Architecture
- **frontend/**: SPA Vue.js (Vue 3 + vue-router)
- **backend/**: Node.js + Express, MongoDB pour le stockage
- **docker-compose.yml**: orchestration frontend + backend + base de données (facultatif selon votre infra)

---

## Prérequis
- Node.js 18+
- npm 9+ ou pnpm/yarn équivalent
- MongoDB 6+ (local ou managé) 
- (Optionnel) Docker + Docker Compose pour un déploiement conteneurisé

---

## Installation (développement)

### 1) Cloner le dépôt
```bash
git clone <url-du-repo>
cd flopStudent
```

### 2) Installer les dépendances
- Frontend
```bash
cd frontend
npm install
```
- Backend
```bash
cd ../backend
npm install
```

### 3) Variables d’environnement (backend)
Créer un fichier `.env` dans `backend/` avec les clés suivantes:
```env
# URL de connexion MongoDB (obligatoire)
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority

# Port du serveur backend (optionnel, 3000 par défaut via server.js si géré)
PORT=3000
```
La base utilisée par défaut est `flopStudent` (configurée dans `backend/config/connectDb.js`).

### 4) Lancer en local
- Backend
```bash
cd backend
npm start
```
Par défaut, l’API écoute sur `http://localhost:3000` (selon votre configuration/`server.js`).

- Frontend
```bash
cd ../frontend
npm run serve
```
L’application est accessible sur `http://localhost:8080` (par défaut Vue CLI).

Astuce: Dans le frontend, configurez la variable `VUE_APP_API_BASE_URL` (fichier `.env` à la racine `frontend/`) pour pointer vers votre backend si nécessaire:
```env
VUE_APP_API_BASE_URL=http://localhost:3000
```

---

## Déploiement

### Backend seul (Docker Compose)
Un `docker-compose.yml` minimal est fourni pour le backend.

Prérequis: définir `MONGODB_URI` dans votre shell (ou fichier `.env` au même niveau que `docker-compose.yml`).

```bash
# Exemple (PowerShell / Bash)
$env:MONGODB_URI="mongodb+srv://user:pass@cluster/db?retryWrites=true&w=majority"
# Mapping de port optionnel (HOST:CONTAINER), défaut 3000:3000
$env:PORT_MAPPING="8081:3000"

docker compose up -d --build
```

- Accès API: `http://localhost:8081` (ou `http://localhost:3000` si vous gardez la valeur par défaut)
- Variables utilisées par le compose:
  - `MONGODB_URI` (obligatoire)
  - `PORT_MAPPING` (optionnelle, défaut `3000:3000`)

### Frontend seul (build et hébergement statique)
Le `frontend/Dockerfile` construit l’app (stage de build). Il ne sert pas les fichiers; vous devez les héberger (Nginx, Apache, S3, Netlify, etc.).

1) Construire l’image de build et produire le dossier `dist`:
```bash
cd frontend
# Définir l’URL du backend utilisée par le frontend en production
docker build --build-arg VUE_APP_API_BASE_URL=https://api.mondomaine.tld -t flopstudent-frontend:build .

# Récupérer le dossier dist/ depuis l’image
CONTAINER_ID=$(docker create flopstudent-frontend:build)
docker cp $CONTAINER_ID:/app/dist ./dist
docker rm $CONTAINER_ID
```

2) Servir `dist/` avec Nginx (exemple Docker rapide):
```bash
# Docker Nginx servant ./dist sur le port 8080
docker run --name flopstudent-nginx -p 8080:80 -v ${PWD}/dist:/usr/share/nginx/html:ro -d nginx:alpine
```

- Accès Front: `http://localhost:8080`
- Assurez-vous que `VUE_APP_API_BASE_URL` pointe vers votre backend public (ex: `https://api.mondomaine.tld`).

### Backend + Frontend
Vous pouvez déployer chaque partie indépendamment, puis:
- Backend (Docker Compose ci-dessus) exposé publiquement derrière un reverse-proxy (HTTPS recommandé).
- Frontend (build + hébergement statique) pointant vers `VUE_APP_API_BASE_URL` du backend.

Exemple de workflow minimal:
```bash
# 1) Backend
# (voir section Backend seul) -> API disponible (ex: https://api.mondomaine.tld)

# 2) Frontend
cd frontend
docker build --build-arg VUE_APP_API_BASE_URL=https://api.mondomaine.tld -t flopstudent-frontend:build .
CONTAINER_ID=$(docker create flopstudent-frontend:build)
docker cp $CONTAINER_ID:/app/dist ./dist
docker rm $CONTAINER_ID
# Servir dist/ (Nginx, Netlify, S3+CloudFront, etc.)
```

Remarques:
- Pour un hébergement tout-Docker, vous pouvez ajouter un service Nginx dans `docker-compose.yml` qui monte `./frontend/dist` (après build) et proxifie l’API.
- En dev, `frontend/vue.config.js` proxifie `/api` vers `http://localhost:3000`. En prod, le frontend utilise exclusivement `VUE_APP_API_BASE_URL` avant build.

---

## Variables d’environnement (récap)
- Backend (`backend/.env`)
  - `MONGODB_URI` (obligatoire): chaîne de connexion MongoDB
  - `PORT` (optionnel): port d’écoute du backend
- Frontend (`frontend/.env`)
  - `VUE_APP_API_BASE_URL` (recommandé): URL publique du backend (ex: `https://api.mondomaine.tld` ou `http://localhost:3000`)

---

## API Backend (documentation rapide)
Base URL: `http://<host>:<port>/` ou `http://mondomaine.fr/`.
Par exemeple : `http://flopstudent-api.belucraft.fr/`

### Emplois du temps
- GET `/api/get-schedules`
  - **Query params (tous requis)**:
    - `year` (string|number): année (ex: 2025)
    - `week` (string|number): semaine ISO (ex: 17)
    - `dept` (string): département (ex: `info`)
    - `train_prog` (string): année de formation (ex: `BUT1`)
    - `groupe` (string): groupe complet (ex: `1A`)
  - **Réponse**: `Array<Object>` (liste de cours), formaté pour l’affichage (heure début, type, nom, salle, prof, groupe, couleurs, etc.)
  - **Erreurs**:
    - `400` si paramètres manquants
    - `500` en cas d’erreur interne

- GET `/api/get-last-schedules-update`
  - **Query params (tous requis)**:
    - `year` (string|number)
    - `week` (string|number)
  - **Réponse**: `Date|null` (timestamp de dernière mise à jour stocké côté backend)
  - **Erreurs**:
    - `400` si paramètres manquants
    - `500` en cas d’erreur interne

### Salles libres
- GET `/api/get-free-rooms`
  - **Query params (tous requis)**:
    - `year` (string|number)
    - `week` (string|number)
    - `dept` (string): département (clé utilisée pour trouver la liste des salles du département)
  - **Réponse**: `{ salles: Record<string, Record<string, string[]>>, lastUpdated: Date }`
    - `salles[dayLetter][slotMinutes] = string[]` (ex: salles libres pour `m` (lundi) à `480` (08:00))
  - **Erreurs**:
    - `400` si paramètres manquants
    - `500` en cas d’erreur interne

---

## Flux de données & tâches programmées
- Le backend dispose d’utilitaires (`backend/utils/`) pour:
  - récupérer et stocker les cours depuis flop!EDT (`fetchAndStoreSchedules`)
  - nettoyer les semaines obsolètes (`cleanOldSchedules`)
  - calculer les salles libres (`calculateFreeRooms`)
  - orchestrer les tâches (`scheduleTasks`)
- Les données sont persistées dans MongoDB (collections par département, `lastUpdates`, etc.).

---

## Développement frontend
- Lancer le serveur de dev: `npm run serve`
- Endpoints front principaux:
  - `src/components/ScheduleList.vue`: affichage EDT, navigation par semaine
  - `src/components/FreeRoomsList.vue`: affichage des salles libres
  - `src/components/SettingsParams.vue`: configuration locale (dept, année, groupe)
- Les utilitaires front sont centralisés dans `src/utils/` et `src/services/` (accès API, formatage dates, stockage local)

---

## Conseils pour contribuer
- Respecter la structure actuelle (services/utils, séparation front/back)
- Mutualiser la logique réutilisable dans `utils/`
- Ajouter la JSDoc pour les fonctions publiques et les services
- Proposer des PR atomiques (petites, testables)

---

## Licence
Projet open source. La licence sera précisée dans un prochain commit si elle n’est pas déjà fournie.