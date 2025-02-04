const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const morgan = require("morgan");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const LogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  action: String,
  details: String,
  timestamp: { type: Date, default: Date.now },
});
const Log = mongoose.model("Log", LogSchema);

// Schéma pour les utilisateurs
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "vendeur", "client", "gestionnaire", "analyste"],
    default: "client",
  },
});
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const User = mongoose.model("User", UserSchema);

// Schéma pour les produits
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  category: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Product = mongoose.model("Product", ProductSchema);

// Schéma pour les commandes
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
    },
  ],
  total: Number,
  paymentDetails: {
    method: String,
    status: {
      type: String,
      enum: ["en attente", "payé", "échoué"],
      default: "en attente",
    },
  },
  status: {
    type: String,
    enum: ["confirmée", "expédiée", "livrée", "annulée"],
    default: "confirmée",
  },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", OrderSchema);

// Middleware pour vérifier la présence et la validité du token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token)
    return res.status(403).json({ message: "Accès refusé: token manquant" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token invalide" });
    req.user = decoded;
    next();
  });
};

// Middleware pour vérifier le rôle de l'utilisateur
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Accès refusé: droits insuffisants" });
    }
    next();
  };
};

// Fonction utilitaire pour enregistrer les logs
const addLog = async (user, action, details) => {
  const log = new Log({ user, action, details });
  await log.save();
};

// Enregistrement d'un utilisateur
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = new User({ username, email, password, role });
    await user.save();
    await addLog(user._id, "REGISTER", `Utilisateur ${username} créé`);
    res.status(201).json({ message: "Utilisateur créé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Connexion
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    await addLog(user._id, "LOGIN", `Utilisateur ${user.username} connecté`);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mise à jour des informations personnelles de l'utilisateur
app.put("/users/me", authenticate, async (req, res) => {
  try {
    const updateData = req.body;
    // Si le mot de passe est modifié, le pré-save du schéma se charge de le hasher
    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    });
    await addLog(
      req.user.id,
      "UPDATE_USER",
      `Utilisateur ${user.username} mis à jour`
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Désactivation/Suppression du compte utilisateur (soft delete ou delete définitif)
app.delete("/users/me", authenticate, async (req, res) => {
  try {
    // Ici, pour simplifier, on effectue une suppression définitive
    await User.findByIdAndDelete(req.user.id);
    await addLog(req.user.id, "DELETE_USER", `Utilisateur supprimé`);
    res.json({ message: "Compte utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Création d'un produit (vendeur ou admin)
app.post(
  "/products",
  authenticate,
  checkRole(["vendeur", "admin"]),
  async (req, res) => {
    try {
      const product = new Product({ ...req.body, seller: req.user.id });
      await product.save();
      await addLog(
        req.user.id,
        "CREATE_PRODUCT",
        `Produit ${product.name} créé`
      );
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Lecture de tous les produits
app.get("/products", authenticate, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lecture d'un produit par ID
app.get("/products/:id", authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "username email"
    );
    if (!product)
      return res.status(404).json({ message: "Produit non trouvé" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mise à jour d'un produit (vendeur ou admin)
app.put(
  "/products/:id",
  authenticate,
  checkRole(["vendeur", "admin"]),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      await addLog(
        req.user.id,
        "UPDATE_PRODUCT",
        `Produit ${product.name} mis à jour`
      );
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Suppression (ou désactivation) d'un produit (vendeur ou admin)
app.delete(
  "/products/:id",
  authenticate,
  checkRole(["vendeur", "admin"]),
  async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      await addLog(
        req.user.id,
        "DELETE_PRODUCT",
        `Produit supprimé, ID: ${req.params.id}`
      );
      res.json({ message: "Produit supprimé" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Création d'une commande par un client
app.post("/orders", authenticate, checkRole(["client"]), async (req, res) => {
  try {
    const { items, paymentDetails } = req.body;
    // Calcul du total de la commande
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const order = new Order({
      user: req.user.id,
      items,
      total,
      paymentDetails,
    });
    await order.save();
    await addLog(
      req.user.id,
      "CREATE_ORDER",
      `Commande créée avec total ${total}`
    );
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Récupérer les commandes d'un utilisateur (client ou vendeur selon contexte)
app.get("/orders", authenticate, async (req, res) => {
  try {
    let orders;
    // Si l'utilisateur est client, on récupère ses commandes
    if (req.user.role === "client") {
      orders = await Order.find({ user: req.user.id }).populate(
        "items.product",
        "name price"
      );
    } else if (req.user.role === "vendeur") {
      // Pour le vendeur, récupérer les commandes contenant ses produits
      orders = await Order.find().populate(
        "items.product",
        "name price seller"
      );
      orders = orders.filter((order) =>
        order.items.some(
          (item) => item.product.seller.toString() === req.user.id
        )
      );
    } else {
      // Pour admin ou autres rôles autorisés, on retourne toutes les commandes
      orders = await Order.find().populate("items.product", "name price");
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mise à jour du statut d'une commande (gestionnaire de commandes ou admin)
app.put(
  "/orders/:id/status",
  authenticate,
  checkRole(["gestionnaire", "admin"]),
  async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      await addLog(
        req.user.id,
        "UPDATE_ORDER",
        `Commande ${order._id} mise à jour au statut ${status}`
      );
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Suppression d'une commande (optionnelle)
app.delete(
  "/orders/:id",
  authenticate,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      await addLog(
        req.user.id,
        "DELETE_ORDER",
        `Commande supprimée, ID: ${req.params.id}`
      );
      res.json({ message: "Commande supprimée" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* =====================
   Démarrage du Serveur
   ===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
