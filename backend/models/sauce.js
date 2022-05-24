//importation du module monggose
const mongoose= require('mongoose');

//definition de notre modele sauce avec le module mongoose
//definition des champs du module avec leur type de donnés ,et puis tous les champs sont required
const sauceShema = mongoose.Schema({
 userId : { type : String, required : true},
 name : { type : String, required : true},
 manufacturer : { type : String, required : true},
 description : { type : String, required : true},
 mainPepper : { type : String, required : true},
 imageUrl : { type : String,required : true},
 heat : { type : Number, required : true},
 likes : { type : Number ,required :true},
 dislikes : { type : Number, required : true},
 usersLiked : { type : [String], required : true},
 usersDisliked :{ type : [String], required : true},
});

//export du modele sauce
module.exports = mongoose.model('Sauce', sauceShema);