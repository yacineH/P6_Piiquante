//import du module mongoose
const mongoose= require('mongoose');
//import du module mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');

//definition du modele user avec mongoose
//champ email est unique qui sera validé par unique-validator
const userShema = mongoose.Schema({
  email : { type : String, required : true, unique : true},
  password : { type : String, required : true},
});

//application uniquevalidator a notre shema user 
userShema.plugin(uniqueValidator);

//export du model user
module.exports = mongoose.model('User',userShema);