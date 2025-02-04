# Documentation Front-end – Application E-commerce

Ce document décrit l'application front-end construite avec React et TypeScript pour interagir avec l'API e-commerce back-end.

## Table des matières

- [Installation et configuration](#installation-et-configuration)
- [Architecture du projet](#architecture-du-projet)
- [Configuration de l'environnement](#configuration-de-lenvironnement)
- [Démarrage de l'application](#démarrage-de-lapplication)
- [Utilisation de l'application](#utilisation-de-lapplication)
- [Structure des composants](#structure-des-composants)
- [Exemples d'interactions avec l'API](#exemples-dinteractions-avec-lapi)

## Installation et configuration

1. **Cloner le dépôt**
```bash
cd frontend
npm install
```

2. **Configuration du projet**  
Assurez-vous que l'URL de l'API (http://localhost:5000/api/...) correspond à votre back-end.

## Architecture du projet

```
frontend/
├── public/                     # Fichiers statiques
└── src/
    ├── components/            
    │   ├── Login.tsx          
    │   ├── ProductList.tsx    
    │   ├── CreateProduct.tsx  
    │   └── CreateOrder.tsx    
    ├── App.tsx                
    └── index.tsx              
```

## Configuration de l'environnement

### TypeScript
- Fichier tsconfig.json à la racine
- Support des fichiers .tsx

### Scripts NPM
```bash
npm start    # Lance le serveur de développement
npm run build # Build de production
```

## Démarrage de l'application

1. Installer les dépendances
```bash
npm install
```

2. Lancer l'application
```bash
npm start
```
Accessible sur http://localhost:3000

## Utilisation de l'application

- **Connexion**: Formulaire d'authentification (Login.tsx)
- **Produits**: Liste et création (ProductList.tsx, CreateProduct.tsx)  
- **Commandes**: Passage de commandes (CreateOrder.tsx)

## Structure des composants

### App.tsx
- Point d'entrée
- Gestion du token d'authentification

### Login.tsx
- Formulaire de connexion
- Stockage du JWT

### ProductList.tsx
- Affichage des produits
- Requête GET /api/products

### CreateProduct.tsx
- Création de produits (vendeurs/admin)
- Requête POST /api/products

### CreateOrder.tsx
- Passage de commandes
- Requête POST /api/orders

## Exemples d'interactions avec l'API

### Connexion
```json
{
  "email": "john@example.com",
  "password": "password"
}
```

### Création produit
```json
{
  "name": "Produit Exemple",
  "description": "Description du produit",
  "price": 29.99,
  "quantity": 50,
  "category": "Electronique"
}
```

### Création commande
```json
{
  "items": [
    {
      "product": "ID_DU_PRODUIT",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "paymentDetails": {
    "method": "carte bancaire",
    "status": "en attente"
  }
}
```

> Note: Toutes les requêtes nécessitent l'en-tête `Authorization: Bearer <JWT_TOKEN>`
