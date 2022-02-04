const express = require("express");
// Import d'express
const router = express.Router();
// Application du router issu d'express

const userCtrl = require("../controllers/user");
// Import des logiques de routes des utilisateurs
const checkPassword = require("../middleware/check-password");
// Import du middleware pour imposer un mot de passe fort

/* Routes pours les utilisateurs */

router.post("/signup", checkPassword, userCtrl.signup);
// Association du middleware "checkPassord"
// Association de la logique de route signup à la route POST
router.post("/login", userCtrl.login);
// Association de la logique de route login à la route POST


module.exports = router;
