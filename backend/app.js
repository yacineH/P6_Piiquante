//importation des modules : express,mongoose,dotenv,path
const express = require('express');
const mongoose = require('mongoose');
const dotenv =require('dotenv');
const path = require('path');

//importation des routes 
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//initialisation app express
const app = express();

//initialisation de dotenv
dotenv.config();

//connection a notre base Mongo
mongoose.connect(`${process.env.ConnString}`,
  { useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//middleware pour lecture du body dans la request
app.use(express.json());

//middleware gestion des cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//middleware pour le rapertoire static images
app.use('/images', express.static(path.join(__dirname, 'images')));

//middleware pour route sauce et user
app.use('/api/sauces',sauceRoutes);
app.use('/api/auth',userRoutes);

//permet export de notre app
module.exports = app;