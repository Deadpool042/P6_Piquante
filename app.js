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

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.disable("x-powered-by");

app.use((req, res, next) => {
  //Mise en place de la statégie des headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  //Autorise toutes les origines
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  //Autorise certains type de headers
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
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
