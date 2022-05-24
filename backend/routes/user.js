//importation du module express
const express = require('express');
//creation du router avec express
const router = express.Router();

//importation du controller user
const userCtrl = require('../controllers/user');

//configuration du router avec les deux routes 
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//export du router
module.exports = router;