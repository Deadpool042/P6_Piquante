const express = require("express");
// Import d'express
const router = express.Router();
// Import du router d'express

const auth = require("../middleware/auth");
//Import du middleware d'authenfication
const sauceCtrl = require("../controllers/sauce");
//Importe des logiques de routes des sauces

const multer = require("../middleware/multer-config");
//Import du middleware de config de multer

/* Routes pour les sauces */

router.get("/", auth, sauceCtrl.getAll);
//Association de l'authentification, du chemin de route et
//de la logique de route
router.get("/:id", auth, sauceCtrl.getOne);

router.post("/", auth, multer, sauceCtrl.create);

router.put("/:id", auth, multer, sauceCtrl.modify);

router.delete("/:id", auth, sauceCtrl.deleteOne);

router.post("/:id/like", auth, sauceCtrl.statusLike);

module.exports = router;
//export du router
