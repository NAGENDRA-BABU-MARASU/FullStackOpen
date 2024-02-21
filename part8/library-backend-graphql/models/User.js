const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minLength: 3,
	},
  passwordHash: String, 
  favoriteGenre: String
});

schema.set('toJSON', {
  transform: (document, returnedObject) => { 
    delete returnedObject.passwordHash
  }
})

schema.plugin(uniqueValidator);
module.exports = mongoose.model('User', schema);
