const multer = require("multer");
// Import de multer

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};
// Les extensions gérées

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  //Défini la destination, soit le dossier image
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
  // Récupere le nom original du fichier puis le split et join _ 
  // afin d'eviter les erreurs eventuelles des espaces
    const extension = MIME_TYPES[file.mimetype];
  //Récupere l'extention nécessaire en fonction de l'orignal
    callback(null, name + Date.now() + "." + extension);
  // crée un fichier avec un time stamp pour les rendre encore plus unique  
  },
});

module.exports = multer({ storage }).single("image");
// precise qu'il s'agit d'un fichier unique
