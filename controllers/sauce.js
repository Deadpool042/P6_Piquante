const Sauce = require("../models/sauce"); // Importer le modèle mongoose
const fs = require("fs"); //Importer le package fs pour pouvoir supprimer
// des fichiers par la route DELETE

exports.getAll = (req, res, next) => {
  Sauce.find()
    // La méthode .find() permet de rechercher
    .then((sauces) => res.status(200).json(sauces))
    // renvoi un tableau de toutes les sauces présentes
    .catch((error) => res.status(400).json({ error }));
  // renvoi une erreur 400 (mauvause requête) le cas échéant
};

exports.getOne = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    //La méthode .findOne() permet de chercher un seul élément
    //en utilisant req.params.id, il va recupérer uniquement
    //l'objet stocké avec l'id envoyé du frontend
    .then((sauce) => res.status(200).json(sauce))
    //Renvoie un tableau avec la sauce correspondante
    .catch((error) => res.status(404).json({ error }));
  //Renvoi une error le cas échéant.
};
exports.create = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //La méthode .parse() permet d'analyser la chaine de caractères JSON
  //de la requête issue du formulaire du frontend et la convertie
  //en tableau pour pouvoir l'a traiter puis l'a stock dans la
  //constante sauceObject
  delete sauceObject._id;
  //supprime l'_id créé automatiquement par mongoose afin
  //d'éviter les erreurs d'identification de l'objet
  const sauce = new Sauce({
    //Utilise le schéma de sauce de mongoose
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    //ajout à la requête le corps (body) de la requête
    //puis les objets "likes" et "dislikes"
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    //ajoute également une image avec le lien dynamique concaténé
    //Le tout stocké dans la constante sauce
  });
  sauce
    .save()
    //La méthode .save() permet de sauvegarder la constante sauce
    //dans la bdd. C'est à dire créer une nouvelle sauce.
    .then(() => res.status(201).json({ message: "objet enregistré" }))
    //renvoi un code 201(Ressource créée) et un message
    .catch((error) => res.status(400).json({ error }));
  //renvoi une erreur 400 le cas échéant
};
exports.deleteOne = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // .findOne() récupère le produit concerné par l'id de la requête
    if (!sauce) {
      // Si true (l'objet n'existe pas)
      return res.status(404).json({ error: error | "Objet non trouvé" });
      //retourne une erreur 404 (ressource non trouvée) appuyé d'un message d'erreur
    }
    //Si false (l'objet existe)
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {});
    //supprime le fichier (l'image) lié a l'objet
    Sauce.deleteOne({ _id: req.params.id })
      // suppression de l'objet du parametre de requête dans la bdd
      .then(() => res.status(200).json({ message: "Objet supprimé" }))
      // renvoi un code 200(ok) appuyé d'un message
      .catch((error) => res.status(400).json({ error }));
    // renvoi une erreur 400 l cas échéant
  });
};

exports.modify = (req, res, next) => {
  const sauceObject = req.file
    ? //Recupère le fichier de la requête
      {
        //Si le fichier existe et qu'il est different,
        ...JSON.parse(req.body.sauce),
        //recupere et applique la méthode .parse() à la requête
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        //puis modifie le fichier (l'image en l'occurence) associé
      }
    : { ...req.body };
  //Si le fichier n'est pas different,
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    // mets juste a jour l'objet dans la bdd
    .then(res.status(200).json({ message: "Objet modifié" }))
    //Renvoi un code 200 (ok) appuyé d'un message
    .catch((error) => res.status(400).json({ error }));
  //Renvoi une erreur 400 le cas échéant
};
exports.statusLike = (req, res, next) => {
  // stockage des données nécessaires pour la lecture et comprehension du code
  let like = req.body.like;
  // correspond à l'état du "like" venant du frontend, 1 si like, 0 si neutre, -1 si dislike
  let userId = req.body.userId;
  // correspond à l'user qui a changé le status du "like"
  let sauceId = req.params.id;
  // correponds au paramètre de requête de l'objet ciblé

  switch (like) {
    case 1:
      Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 } })
        // Si like = 1 , push l'userId dans le tableau "usersLiked"  + incremente de 1 likes
        // l'objet like du schéma sauce --> mets a jour la bdd
        .then(() => res.status(200).json({ message: "like" }))
        .catch((error) => res.status(400).json({ error }));

      break;

    case 0:
      Sauce.findOne({ _id: sauceId })
        // recherche l'objet ciblé dans la bdd
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            //S'il l'userId est dans le tableau usersLiked
            Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
              //Mets a jour la bdd --> enleve l'userId de usersLiked et incremente likse de -1
              .then(() => res.status(200).json({ message: `Neutre` }))
              //Renvoi un code 200 (ok) appuyé d'un message
              .catch((error) => res.status(400).json({ error }));
            //Renvoi une erreur 400 le cas échéant
          }
          if (sauce.usersDisliked.includes(userId)) {
            //S'il l'userId est dans le tableau usersDisliked
            Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
              //Mets a jour la bdd --> enleve l'userId de usersDisliked et incremente dislikes de -1
              .then(() => res.status(200).json({ message: `Neutre` }))
              //Renvoi un code 200 (ok) appuyé d'un message
              .catch((error) => res.status(400).json({ error }));
            //Renvoi une erreur 400 le cas échéant
          }
        })
        .catch((error) => res.status(404).json({ error }));
      //Renvoi une erreur 404 le cas échéant
      break;

    case -1:
      Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
        // Si like = -1 , push l'userId dans le tableau "usersDiskliked"  + incremente de 1
        // l'objet disklikes du schéma sauce --> mets a jour la bdd
        .then(() => {
          res.status(200).json({ message: "dislike" });
          //Renvoi un code 200(ok) appuyé d'un message
        })
        .catch((error) => res.status(400).json({ error }));
      //Renvoi une erreur 400 le cas échéant
      break;

    default:
      console.log(error);
  }
};
