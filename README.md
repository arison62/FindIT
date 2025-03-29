# FindIT - Plateforme de retrouvailles d'objets


## 📋 Table des matières
- [FindIT - Plateforme de retrouvailles d'objets](#findit---plateforme-de-retrouvailles-dobjets)
  - [📋 Table des matières](#-table-des-matières)
  - [🗂 Structure du projet](#-structure-du-projet)
  - [🛠 Prérequis](#-prérequis)
  - [🚀 Installation](#-installation)
  - [🤝 Contribuer](#-contribuer)
    - [Règles de collaboration](#règles-de-collaboration)
    - [Convention de commits](#convention-de-commits)
  - [🔄 Workflow Git](#-workflow-git)
  - [📚 Documentation](#-documentation)
  - [📝 Fichiers utiles](#-fichiers-utiles)

## 🗂 Structure du projet
```
FindIT/
├── backend/               # API REST
│   ├── src/               # Code source
│   ├── .env.example       # Variables d'environnement
│   └── package.json
│
├── frontend/              # Application web
│   ├── public/            # Assets statiques
│   ├── src/               # Composants React 
│   └── package.json
│
├── docs/                  # Documentation technique
├── README.md              # Ce fichier
└── LICENSE
```

## 🛠 Prérequis
- Node.js v22+
- MongoDB Atlas
- Postman (pour tester l'API)
- Git + GitHub CLI

## 🚀 Installation
```bash
# Cloner le dépôt
git clone https://github.com/votre-user/FindIT.git
cd FindIT

# Installer les dépendances
cd backend && npm install
cd ../frontend && npm install

# Démarrer en mode développement
npm run dev (dans les deux dossiers)
```

## 🤝 Contribuer
### Règles de collaboration
1. Toujours travailler sur une nouvelle branche :
```bash
git checkout -b feat/nouvelle-fonctionnalite
```
2. Garder les commits atomiques :
```bash
git commit -m "feat(api): ajout endpoint signalement"
```
3. Ouvrir une Pull Request (PR) avec :
- Description claire des changements
- Captures d'écran si applicable
- Référence aux issues concernées

### Convention de commits
| Prefixe   | Description                |
|-----------|----------------------------|
| feat      | Nouvelle fonctionnalité    |
| fix       | Correction de bug          |
| docs      | Modification documentation |
| refactor  | Refactoring de code        |

## 🔄 Workflow Git
```mermaid
graph LR
  A[Création d'issue] --> B[Branche feature]
  B --> C[Pull Request]
  C --> D{Revue par mainteneur}
  D -->|Approuvé| E[Merge sur main]
  D -->|Rejeté| F[Corrections]
```

## 📚 Documentation
- [Documentation API (Swagger)](http://localhost:3000/api-docs)
- [Guide de style frontend](/docs/STYLEGUIDE.md)
- [Architecture technique](/docs/ARCHITECTURE.md)

## 📝 Fichiers utiles
1. Fichier `.env.example` (à copier en `.env`) :
```ini
# Backend
DB_URI=mongodb+srv://user:pass@cluster.mongodb.net/findit
JWT_SECRET=secret_key
GOOGLE_MAPS_API_KEY=your_key

# Frontend
VITE_API_URL=http://localhost:3000/api
```
