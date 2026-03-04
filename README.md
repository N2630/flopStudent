# FlopStudent

![Logo FlopStudent](./frontend/src/assets/logo.png "Logo FlopStudent")

FlopStudent est une application web open source alternative à [flop!EDT](https://www.flopedt.org/). Elle permet aux étudiants de consulter leur emploi du temps (EDT) et les salles libres de l'IUT avec une interface plus intuitive et facile d'utilisation (notamment sur mobile). Le projet s'inspire de flop!EDT en ajoutant une expérience optimisée : mobile-friendly, mode hors-ligne, salles libres, et d'autres fonctionnalités à venir.

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Aperçu](#aperçu)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation (développement)](#installation-développement)
  - [Cloner le dépôt](#1-cloner-le-dépôt)
  - [Installer les dépendances](#2-installer-les-dépendances)
  - [Variables d'environnement](#3-variables-denvironnement)
  - [Lancer en local](#4-lancer-en-local)
- [Déploiement (production)](#déploiement-production)
  - [Avec Docker Compose](#avec-docker-compose)
  - [Build manuel (sans Docker)](#build-manuel-sans-docker)
- [Variables d'environnement (récapitulatif)](#variables-denvironnement-récapitulatif)
- [API Backend](#api-backend)
  - [Emplois du temps](#emplois-du-temps)
  - [Salles libres](#salles-libres)
  - [Professeurs](#professeurs)
  - [Salles](#salles)
  - [Paramètres / Configuration](#paramètres--configuration)
  - [Codes d'erreur](#codes-derreur)
- [Flux de données & tâches programmées](#flux-de-données--tâches-programmées)
- [Contribuer](#contribuer)
- [Licence](#licence)

---

## Fonctionnalités

| Fonctionnalité | Description |
|----------------|-------------|
| **Emploi du temps** | Consultation de l'EDT par groupe, avec une interface épurée et lisible |
| **Salles libres** | Visualisation des salles disponibles en temps réel |
| **Recherche profs** | Trouver un professeur et consulter son emploi du temps |
| **Recherche salles** | Consulter l'occupation d'une salle spécifique |
| **Mobile-friendly** | Interface responsive optimisée pour smartphone |
| **Thèmes** | Mode clair/sombre selon vos préférences |
| **Mode "hors-ligne"** | Accès aux données même si Flop!EDT est injoignable |
| **Suivi d'EDT** | Suivez l'emploi du temps de plusieurs groupes en favoris |

---

## Aperçu

### Version mobile

<p align="center">
  <img src="./docs/screenshots/EdtMobile.webp" alt="EDT Mobile" width="250"/>
  <img src="./docs/screenshots/SallesLibresMobile.webp" alt="Salles libres Mobile" width="250"/>
  <img src="./docs/screenshots/MenuMobile.webp" alt="Menu Mobile" width="250"/>
</p>

### Version desktop

![Vue desktop - Emploi du temps](./docs/screenshots/EdtDesktop.webp "Emploi du temps sur desktop")

![Vue desktop - Salles libres](./docs/screenshots/SallesLibresDesktop.webp "Salles libres sur desktop")

![Vue desktop - Recherche professeur](./docs/screenshots/MenuDesktop.webp "Recherche de professeur")



---

## Architecture

```
flopStudent/
├── frontend/          # SPA Vue.js (Vue 3 + vue-router)
├── backend/           # API Node.js + Express, MongoDB
└── docker-compose.yml # Orchestration des services
```

| Composant | Technologies |
|-----------|-------------|
| Frontend  | Vue 3, Vue Router, Axios |
| Backend   | Node.js, Express, MongoDB |
| Base de données | MongoDB 6+ |

---

## Prérequis

| Outil | Version minimale | Obligatoire |
|-------|-----------------|-------------|
| Node.js | 18+ | Oui |
| npm | 9+ | Oui (ou pnpm/yarn) |
| MongoDB | 6+ | Oui |
| Docker | 20+ | Non (optionnel) |
| Docker Compose | 2+ | Non (optionnel) |

---

## Installation (développement)

### 1. Cloner le dépôt

```bash
git clone https://github.com/N2630/flopStudent.git
cd flopStudent
```

### 2. Installer les dépendances

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Variables d'environnement

**Backend** — Créer `backend/.env` :

```env
# Connexion MongoDB (obligatoire)
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority

# Port du serveur (optionnel, défaut: 3000)
PORT=3000
```

**Frontend** — Créer `frontend/.env` :

```env
# URL de l'API backend (optionnel en dev, le proxy s'en charge)
VUE_APP_API_BASE_URL=http://localhost:3000
```

### 4. Lancer en local

Ouvrir deux terminaux :

```bash
# Terminal 1 - Backend
cd backend
npm start
# → API disponible sur http://localhost:3000
```

```bash
# Terminal 2 - Frontend
cd frontend
npm run serve
# → App disponible sur http://localhost:8080
```

> **Note** : En développement, le proxy Vue (`vue.config.js`) redirige automatiquement les appels `/api` vers le backend.

---

## Déploiement (production)

### Avec Docker Compose

C'est la méthode recommandée pour déployer l'application complète.

**1. Configurer les variables d'environnement**

Créer un fichier `.env` à la racine du projet :

```env
MONGODB_URI=mongodb://admin:secret_root_password@database:27017/flopStudent?authSource=admin ou MongoDB URI (trouvable dans l'interface mongo mongodb+srv://user:pass@cluster/db?retryWrites=true&w=majority )
PORT_MAPPING=3000:3000
VUE_APP_API_BASE_URL=https://api.votre-domaine.fr
DB_ROOT_USERNAME=admin
DB_ROOT_PASS=changezMoi
```

Créer en suite le fichier docker-compose en y mettant l'[exemple](./docker-compose.yml) présent dans le dépôt

> **Note** : Le backend et le frontend étant "indépendant" il tout à fait possible de ne dépolyé que le frontend à condition de le relier à un backend existant

> **Note** : Pensez à copier le fichier [init-db.js](./init-db.js) afin de créer la BD au moins lors de la première initialisation

**2. Lancer les conteneurs**

```bash
docker compose up -d --build
```

**3. Vérifier les services**

```bash
docker compose ps
docker compose logs -f
```

| Service | URL |
|---------|-----|
| Backend API | `http://localhost:3000` |
| Frontend | `http://localhost:8080` |

### Build manuel (sans Docker)

**Backend :**

```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

**Frontend :**

```bash
cd frontend
npm install
npm run build
# Les fichiers statiques sont générés dans dist/
```

Servir le dossier `dist/` avec un serveur web (Nginx, Apache, etc.).

**Exemple avec Nginx :**

```nginx
server {
    listen 80;
    server_name votre-domaine.fr;
    root /var/www/flopstudent/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Variables d'environnement (récapitulatif)

| Variable | Fichier | Obligatoire | Description |
|----------|---------|-------------|-------------|
| `MONGODB_URI` | `backend/.env` | Oui | Chaîne de connexion MongoDB |
| `PORT` | `backend/.env` | Non | Port du serveur backend (défaut: 3000) |
| `VUE_APP_API_BASE_URL` | `frontend/.env` | En prod | URL publique de l'API backend |

---

## API Backend

Base URL : `http://<host>:<port>/api`

Ex : `https://flopstudent-api.belucraft.fr/api`

### Emplois du temps

#### Récupérer l'emplois du temps d'un groupe

**Endpoint :** `GET /get-schedules`

Récupère l'emploi du temps d'un groupe.

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `year` | number | Oui | Année (ex: 2025) |
| `week` | number | Oui | Semaine ISO (ex: 17) |
| `dept` | string | Oui | Département (ex: `info`) |
| `train_prog` | string | Oui | Programme (ex: `BUT1`) |
| `groupe` | string | Oui | Groupe (ex: `1A`) |

**Requête :**
```bash
curl "https://flopstudent-api.belucraft.fr/api/get-schedules?year=2025&week=37&dept=INFO&train_prog=BUT1&groupe=1A"
```

**Réponse :**
```json
[
    {
        "_id":"69711df05db833d373312f9f",
        "id":515402,
        "room":"B106",
        "date":{
            "day":"tu",
            "week":37,
            "year":2025
        },
        "start_time":570,
        "duration":90,
        "course":{
            "type":"TP",
            "name":"Initiation au développement",
            "abbrev":"DevS1",
            "is_graded":false
        },
        "groupe":{
            "name":"1A",
            "train_prog":"BUT1"
        },
        "prof":"BC",
        "display":{
            "color_bg":"#20d8fd",
            "color_txt":"#000000"
        }
    },
    ...
]
```

#### `GET /get-last-schedules-update`

Récupère la date de dernière mise à jour des emplois du temps.

| Paramètre | Type | Obligatoire |
|-----------|------|-------------|
| `year` | number | Oui |
| `week` | number | Oui |

**Requête :**
```bash
curl "https://flopstudent-api.belucraft.fr/api/get-last-schedules-update?year=2025&week=37"
```

**Réponse :**
```
"2026-01-21T18:42:11.396Z"
```

### Salles libres

#### `GET /get-free-rooms`

Récupère les salles libres pour une semaine donnée, avec possibilité de filtrer par jour et créneau.

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `year` | number | Oui | Année (ex: 2025) |
| `week` | number | Oui | Semaine ISO (ex: 37) |
| `dept` | string | Oui | Département (ex: `INFO`) |
| `day` | string | Non | Jour (ex: `L`, `Ma`, `Me`, `J`, `V`) |
| `slot` | number | Non | Créneau horaire en minutes depuis minuit (ex: 480 pour 8h) |

**Requête (semaine complète) :**
```bash
curl "https://flopstudent-api.belucraft.fr/api/get-free-rooms?year=2025&week=37&dept=INFO"
```

**Requête (jour et créneau spécifique) :**
```bash
curl "https://flopstudent-api.belucraft.fr/api/get-free-rooms?year=2025&week=37&dept=INFO&day=L&slot=480"
```

**Réponse :**

```json
{
    "salles": {
        "l":{
            "480":[
                "B101","B102","B103","B104","B105","B106","B004","B005","B007","B008","B009","B010","B115","B219","B113","B006"
            ]
        }
    },
    "lastUpdated":"2026-03-04T17:19:15.339Z"
}
```

### Professeurs

#### `GET /get-all-profs`

Récupère la liste de tous les professeurs.

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `dept` | string | Non | Département pour filtrer (ex: `INFO`) |

**Requête :**
```bash
curl "https://flopstudent-api.belucraft.fr/api/get-all-profs?dept=INFO"
```

**Réponse :**
```json
[
    {
        "_id":"697111a0151a06b9cad4fe38",
        "username":"BC",
        "departments":["INFO"],
        "email":"belucraft.carre@cubemail.com",
        "first_name":"Belucraft",
        "last_name":"Carré"
    },
    ...
]
```

#### `GET /get-prof-schedule`

Récupère l'emploi du temps d'un professeur.

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `year` | number | Oui | Année (ex: 2025) |
| `week` | number | Oui | Semaine ISO (ex: 37) |
| `profDet` | string | Oui | Initiales du professeur (ex: `MDM`) |

**Requête :**
```bash
curl "https://flopstudent-api.belucraft.fr/api/get-prof-schedule?year=2025&week=37&profDet=MDM"
```

**Réponse :**
```json
[
    {
        "_id":"69711df05db833d373312f9f",
        "id":515402,
        "room":"B106",
        "date":{
            "day":"tu",
            "week":37,
            "year":2025
        },
        "start_time":570,
        "duration":90,
        "course":{
            "type":"TP",
            "name":"Initiation au développement",
            "abbrev":"DevS1",
            "is_graded":false
        },
        "groupe":{
            "name":"1A",
            "train_prog":"BUT1"
        },
        "prof":"BC",
        "display":{
            "color_bg":"#20d8fd",
            "color_txt":"#000000"
        }
    },
    ...
]
```

> **Note** : Le format de réponse de cet endpoint est identique à celui permettant de récupérer l'EDT d'un groupe 

### Salles

#### `GET /get-all-rooms`

Récupère la liste de toutes les salles.

**Requête :**
```bash
curl "https://flopstudent-api.belucraft.fr/api/get-all-rooms"
```

**Réponse :**
```json
[
  {"room":"A011"},
  {"room":"ATCI"},
  {"room":"AUTRE"},
  {"room":"Amphi1"},
  {"room":"Amphi2"},
  ...
]
```

#### `GET /get-room-schedule`

Récupère l'emploi du temps d'une salle.

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `year` | number | Oui | Année (ex: 2025) |
| `week` | number | Oui | Semaine ISO (ex: 37) |
| `room` | string | Oui | Nom de la salle (ex: `B106`) |

**Requête :**
```bash
curl "https://flopstudent-api.belucraft.fr/api/get-room-schedule?year=2025&week=37&room=B106"
```

**Réponse :**
```json
[
    {
        "_id":"69711df05db833d373312f9f",
        "id":515402,
        "room":"B106",
        "date":{
            "day":"tu",
            "week":37,
            "year":2025
        },
        "start_time":570,
        "duration":90,
        "course":{
            "type":"TP",
            "name":"Initiation au développement",
            "abbrev":"DevS1",
            "is_graded":false
        },
        "groupe":{
            "name":"1A",
            "train_prog":"BUT1"
        },
        "prof":"BC",
        "display":{
            "color_bg":"#20d8fd",
            "color_txt":"#000000"
        }
    },
    ...
]
```

> **Note** : Le format de réponse de cet endpoint est identique à celui permettant de récupérer l'EDT d'un groupe 

### Paramètres / Configuration

#### `GET /get-departments`

Récupère la liste des départements disponibles.

**Requête :**
```bash
curl "https://flopstudent-api.belucraft.fr/api/get-departments"
```

**Réponse :**
```json
["CS","GIM","INFO","RT"]
```

#### `GET /get-train-progs`

Récupère les années de formation disponibles pour un département.

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `dept` | string | Oui | Département (ex: `INFO`) |

**Requête :**
```bash
curl "https://flopstudent-api.belucraft.fr/api/get-train-progs?dept=INFO"
```

**Réponse :**
```json
["BUT1", "BUT2", "BUT3"]
```

#### `GET /get-groups`

Récupère les groupes disponibles pour un département et une année.

| Paramètre | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `dept` | string | Oui | Département (ex: `INFO`) |
| `train_prog` | string | Oui | Programme/année (ex: `BUT1`) |

**Requête :**
```bash
curl "https://flopstudent-api.belucraft.fr/api/get-groups?dept=INFO&train_prog=BUT1"
```

**Réponse :**
```json
["1A","1B","2A","2B","3A","3B","4B","4A"]
```

### Codes d'erreur

| Code | Description |
|------|-------------|
| `200` | Succès |
| `400` | Paramètres manquants ou invalides |
| `404` | Ressource non trouvée |
| `500` | Erreur serveur interne |

**Exemple d'erreur :**
```json
{
  "message": "Année, semaine et département sont requis."
}
```

---

## Flux de données & tâches programmées

Le backend gère automatiquement :

| Tâche | Description | Fichier |
|-------|-------------|---------|
| Récupération EDT | Synchronise les cours depuis flop!EDT | `fetchAndStoreSchedules.js` |
| Nettoyage | Supprime les semaines obsolètes | `scheduleTasks.js` |
| Calcul salles libres | Détermine les salles disponibles | `calculateFreeRooms.js` |

Les données sont persistées dans MongoDB (collections par département).

---

## Contribuer

1. Forker le projet
2. Créer une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commiter les changements (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Pousser la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrir une Pull Request

**Bonnes pratiques :**

- Respecter la structure existante (`services/`, `utils/`)
- Ajouter la JSDoc pour les fonctions publiques
- Proposer des PR atomiques et testables

---

## Licence

Ce projet est sous licence **GNU Affero General Public License v3.0 (AGPLv3)**.

Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
