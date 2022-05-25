//import du module express
const express = require('express');
//creation du router avec express
const router = express.Router();

//importation de la middleware auth et celle de multer
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//importation du controller sauce
const sauceCtrl = require('../controllers/sauce');

//configuration de notre router avec les routes de lapplication
//les routes sont toutes securisés avec auth,et multer pour la gestion de file dans le repertoire images
router.get('/',auth,sauceCtrl.getAllSauces);
router.get('/:id',auth,sauceCtrl.getOneSauce);
router.post('/',auth,multer,sauceCtrl.createSauce);
router.put('/:id',auth,multer,sauceCtrl.modifySauce);
router.delete('/:id',auth,sauceCtrl.deleteSauce);
router.post('/:id/like',auth,sauceCtrl.likeSauce);

//export du module router
module.exports = router;