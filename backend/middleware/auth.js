//import du module jsonwebtoken
const jwt = require('jsonwebtoken');

const User = require('../models/user');

/**
 * Permet de verfifier pour chaque request envoyer headers authorization 
 * le token avec userId dans la requette si le userId est le meme que celui du token on continue avec
 * le nest middleware sinon throw exception qui sera catche pour envoyer une response 401
 * @param {request} req 
 * @param {response} res 
 * @param {middleware} next 
 */
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWTPASS);
    const userIdToken = decodedToken.userId;

    User.findOne({_id :userIdToken})
     .then(user=>{
      req.user = userIdToken;
      next();
     })
     .catch(error => res.status(500).json({error}) );
    }
    catch {
       res.status(401).json({message : "Problèmes d'authentification"});
    }
  };
