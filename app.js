const express = require("express");
// Import d'express
const app = express();

const sauceRoutes = require("./routes/sauce");
//Import du fichier ./routes/sauce.js
const userRoutes = require("./routes/user");
//Import du fichier ./routes/user.js
const helmet = require("helmet");
const path = require("path");
//Import path (pour le dossier static 'images')
const dotenv = require("dotenv");
dotenv.config();
//Import le fichier de variables d'environnement (mdp, token, etc...)

const mongoose = require("mongoose");
//Import mongoose
mongoose
  .connect(process.env.MONGO_CONNECT)
  //Utilise .env pour cacher les identifiants de connexion
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
//Connexion au serveur mongo
app.use(express.json());
//Parse le contenu JSON et crée les propriétés req.body nécessaire
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
/* csp : définit l’en-tête Content-Security-Policy pour la protection contre les attaques de type cross-site scripting et autres injections intersites.
hidePoweredBy: supprime l’en-tête X-Powered-By.
hsts: définit l’en-tête Strict-Transport-Security qui impose des connexions (HTTP sur SSL/TLS) sécurisées au serveur.
ieNoOpen: définit X-Download-Options pour IE8+.
noCache: définit des en-têtes Cache-Control et Pragma pour désactiver la mise en cache côté client.
noSniff:  définit X-Content-Type-Options pour protéger les navigateurs du reniflage du code MIME d’une réponse à partir du type de contenu déclaré.
frameguard: définit l’en-tête X-Frame-Options pour fournir une protection clickjacking.
xssFilter: définit X-XSS-Protection afin d’activer le filtre de script intersites (XSS) dans les navigateurs Web les plus récents. */
app.disable("x-powered-by");
//  Les intrus peuvent utiliser cet en-tête (activé par défaut) afin de détecter les applications qui exécutent Express et lancer ensuite des attaques spécifiquement ciblées.

app.use((req, res, next) => {
//Mise en place de la statégie des headers
  res.setHeader("Access-Control-Allow-Origin", "*");
//Autorise toutes les origines
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
//Autorise certains type de headers
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
//Autorise les routes
  next();
});


app.use("/images", express.static(path.join(__dirname, "images")));
//Défini le chemin du dossier où les fichiers sont stockés une fois importés.
app.use("/api/sauces", sauceRoutes);
//Défini le chemin de la route des sauces
//Ca équivaut par exemple à app.XXX("/api/sauces/xxx", 'middleware', 'controllers.XXX)
//Le code est organisé en plusieurs fichiers afin de le rendre modulable
app.use("/api/auth", userRoutes);
//Défini le chemin de la route des users
module.exports = app;
//export express