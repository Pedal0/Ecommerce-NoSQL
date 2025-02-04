# Documentation Back-end – API E-commerce

Ce document décrit l'API RESTful construite avec Node.js, Express et MongoDB pour gérer une application e-commerce.

## Table des matières

- [Installation et configuration](#installation-et-configuration)
- [Variables d'environnement](#variables-denvironnement)
- [Structure de l'API](#structure-de-lapi)
- [Endpoints d'authentification](#endpoints-dauthentification)
- [Endpoints pour les produits](#endpoints-pour-les-produits)
- [Endpoints pour les commandes](#endpoints-pour-les-commandes)
- [Exemples de requêtes](#exemples-de-requêtes)

## Installation et configuration

1. **Cloner le dépôt**  
    Placez-vous dans le répertoire du projet et installez les dépendances dans le dossier `backend` :
    ```bash
    cd backend
    npm install
    ```

2. **Configuration de la base de données**  
    Assurez-vous d'avoir MongoDB installé ou utilisez MongoDB Atlas. L'API se connecte à MongoDB via l'URI fourni dans le fichier .env.

3. **Lancer l'API**  
    Pour démarrer le serveur, exécutez :
    ```bash
    node server.js
    ```
    Vous devriez voir dans la console :
    ```
    MongoDB Connected
    Server running on port 5000
    ```

## Variables d'environnement

Créez un fichier `.env` dans le dossier backend :

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=VotreCleSecreteUltraComplexe
PORT=5000
```

- `MONGO_URI` : URI de connexion à votre base MongoDB
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `PORT` : Port du serveur Express

## Structure de l'API

- `models/` : Schémas Mongoose (User, Product, Order, Log)
- `routes/` : Routes pour auth, produits et commandes
- `middleware/` : Middleware d'authentification
- `seed.js` : Script pour données de test
- `server.js` : Point d'entrée de l'API

## Endpoints d'authentification

### 1. Inscription
- **URL** : `/api/auth/register`
- **Méthode** : POST
- **Body** :
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password",
  "role": "client"
}
```

### 2. Connexion
- **URL** : `/api/auth/login`
- **Méthode** : POST
- **Body** :
```json
{
  "email": "john@example.com",
  "password": "password"
}
```

### 3. Mise à jour utilisateur
- **URL** : `/api/auth/me`
- **Méthode** : PUT
- **Header** : `Authorization: Bearer <JWT_TOKEN>`

### 4. Suppression compte
- **URL** : `/api/auth/me`
- **Méthode** : DELETE
- **Header** : `Authorization: Bearer <JWT_TOKEN>`

## Endpoints pour les produits

### 1. Création
- **URL** : `/api/products`
- **Méthode** : POST
- **Header** : `Authorization: Bearer <JWT_TOKEN>`
- **Body** :
```json
{
  "name": "Produit Exemple",
  "description": "Description du produit",
  "price": 29.99,
  "quantity": 50,
  "category": "Electronique"
}
```

### 2. Lecture produits
- **URL** : `/api/products`
- **Méthode** : GET

### 3. Lecture par ID
- **URL** : `/api/products/:id`
- **Méthode** : GET

### 4. Mise à jour
- **URL** : `/api/products/:id`
- **Méthode** : PUT
- **Header** : `Authorization: Bearer <JWT_TOKEN>`

### 5. Suppression
- **URL** : `/api/products/:id`
- **Méthode** : DELETE
- **Header** : `Authorization: Bearer <JWT_TOKEN>`

## Endpoints pour les commandes

### 1. Création commande
- **URL** : `/api/orders`
- **Méthode** : POST
- **Header** : `Authorization: Bearer <JWT_TOKEN>`
- **Body** :
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

### 2. Lecture commandes
- **URL** : `/api/orders`
- **Méthode** : GET
- **Header** : `Authorization: Bearer <JWT_TOKEN>`

### 3. Mise à jour statut
- **URL** : `/api/orders/:id/status`
- **Méthode** : PUT
- **Header** : `Authorization: Bearer <JWT_TOKEN>`

### 4. Suppression commande
- **URL** : `/api/orders/:id`
- **Méthode** : DELETE
- **Header** : `Authorization: Bearer <JWT_TOKEN>`

## Exemples de requêtes

### Connexion
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password"}'
```

### Création produit
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <VOTRE_JWT_TOKEN>" \
  -d '{
     "name": "Produit Exemple",
     "description": "Description du produit",
     "price": 29.99,
     "quantity": 50,
     "category": "Electronique"
  }'
```

### Passer commande
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <VOTRE_JWT_TOKEN>" \
  -d '{
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
  }'
```
