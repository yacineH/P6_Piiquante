//import du model de donné sauce
const Sauce = require('../models/sauce');
//import du module fs (file system)
const fs= require('fs');

//OK
/**
 * Renvoie un tableau avec toutes les sauces stockés en base
 * @param {request} req 
 * @param {response} res 
 * @param {middleware} next 
 */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
};

//OK
/**
 * Renvoi la sauce a partir de son params id dans la request
 * @param {request} req 
 * @param {response} res 
 * @param {middleware} next 
 */
exports.getOneSauce = (req, res, next) => {
    if(req.params.id){
     Sauce.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
    }
    else{
      res.status(400).json({message : "Problèmes dans la requette"});
    }
};

//ok
/**
 * Enregistre la sauce en base avec initialisation des proprietes de la sauce 
 * definition du chemin dans imageUrl
 * @param {request} req 
 * @param {response} res 
 * @param {middleware} next 
 */
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    likes : 0,
    dislikes : 0,
    usersLiked : [],
    usersDisliked : [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

//OK
/**
 * Met a jour la sauce,verifie dans la request la presance ou pas d'un fichier
 * sans file donc les infos sont dans le body avec sauce en json
 * avec file req.file.filename
 * verifie si le user qui envoi la request est bien le crateur de la sauce 
 * @param {request} req 
 * @param {response} res 
 * @param {middleware} next 
 */
exports.modifySauce = (req, res, next) => {

  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    if(sauce.userId === req.user){
      var sauceObject={};
      if(req.file) { 
        const filename = sauce.imageUrl.split('/images/')[1];
        sauceObject={
            ...JSON.parse(req.body.sauce),
            imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          };
          fs.unlink(`images/${filename}`, () => {
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet modifié !'}))
            .catch(error => res.status(400).json({ error }));
          });
      }
      else{
        sauceObject= { ...req.body};
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
      }
    }
    else{
      res.status(400).json({message: 'Opération non autorisée!'});
    }
  })
  .catch(error => res.status(500).json({ error }));
};

//OK
/**
 * Supprime la sauce a partir de l'id de la request
 * verifie si le user qui envoi la request est bien le createur de la sauce
 * avec filesystem permet de supprimer aussi le fichier correspondant dans le disk dans image
 * une fois le fichier supprimé on supprime la sauce de la base
 * @param {request} req 
 * @param {response} res 
 * @param {middleware} next 
 */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if(sauce.userId === req.user){
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce suppriméé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      }
      else{
        res.status(400).json({message:'Opération non autorisée!'});
      }
    })
    .catch(error => res.status(500).json({ error }));
};

//OK
/**
 * A partir de la valeur like dans la request :0,1,-1 on choit l'action a realiser (annuler,liker,dislike)
 * a partir de id de la sauce on regarde si elle existe apres selon la valeur de like on realise l'action souhaité
 * @param {request} req 
 * @param {response} res 
 * @param {middleware} next 
 */
exports.likeSauce = (req, res, next) => {

   Sauce.findOne({_id : req.params.id})
    .then(sauce => {
      const id=req.body.userId; 

      if(req.body.like === 1){
         if(sauce.usersLiked.length>0 && !sauce.usersLiked.includes(id)){
            sauce.usersLiked.push(id);
            sauce.likes = sauce.likes +1 ;
         }         
         else{
           sauce.usersLiked.push(id);
           sauce.likes = sauce.likes +1 ;
         }
      }
      else if (req.body.like === 0){
        if(sauce.usersLiked.length>0 && sauce.usersLiked.includes(id)){
          const index = sauce.usersLiked.indexOf(id);
          if(index>-1){
             sauce.usersLiked.splice(index,1);
             sauce.likes = sauce.likes - 1;
          }
        }
        if(sauce.usersDisliked.length>0 && sauce.usersDisliked.includes(id)){
          const index = sauce.usersDisliked.indexOf(id);
          if(index>-1) {
            sauce.usersDisliked.splice(id,1);
            sauce.dislikes = sauce.dislikes -1;
          }
        }
      }
      else if (req.body.like === -1){
         if(sauce.usersDisliked.length>0){
          if(!sauce.usersDisliked.includes(id)){    
              sauce.usersDisliked.push(id);
              sauce.dislikes =sauce.dislikes + 1;            
          }
         }
         else{
            sauce.usersDisliked.push(id);
            sauce.dislikes =sauce.dislikes + 1;   
         }
      }
      
      const sauceObj = {
        userId : sauce.userId, 
        name:sauce.name, 
        manufacturer :sauce.manufacturer ,
        description : sauce.description,
        mainPepper : sauce.mainPepper,
        imageUrl : sauce.imageUrl,
        heat : sauce.heat,
        likes : sauce.likes,
        dislikes : sauce.dislikes,
        usersLiked : sauce.usersLiked,
        usersDisliked :sauce.usersDisliked    
      };

      Sauce.updateOne({ _id: req.params.id }, { ...sauceObj, _id: req.params.id })
       .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
       .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({error}));
};