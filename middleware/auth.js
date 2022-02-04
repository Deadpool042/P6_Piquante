const jwt = require("jsonwebtoken");
// Import de jsonwebtoken
const dotenv = require("dotenv");
dotenv.config();
// Import des variables d'environnements

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //Recuperer le token du header créé par le login
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    // verifie le token extrait avec la variable d'envionnement
    const userId = decodedToken.userId;
    // Récupère l'userId depuis le token
    if (req.body.userId && req.body.userId !== userId) {
    // Compare l'userId et l'userId issu du token
      throw "User ID invalide";
    // Si true (ne correspond pas) renvoi l'erreur
    } else {
      next();
    // Si false, lit le middleware suivant,
    // dans notre cas, les controlleurs ou multer pour les sauces
    }
  } catch {
    res.status(401).json({ error: "Requête invalide!" });
  }
};

