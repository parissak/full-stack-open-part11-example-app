const logger = require('./logger')

const mongoose = require('mongoose')

const url = process.env.NODE_ENV === 'test' 
	? process.env.TEST_MONGODB_URI
	: process.env.MONGODB_URI

logger.log('connecting to', url)

mongoose.connect(url)
	.then(() => {
		logger.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

const entryValidator = function(val) {
	if (val.length <8 && typeof val != 'string') {
		return false 
	}
  
	const parts = val.split('-')

	if (parts.length != 2) {
		return false
	}
  
	if ((parts[0].length !== 2 && parts[0].length !== 3) || (parts[1].length !== 7 && parts[1].length !== 8)) {
		return false
	}

  
	if (isNaN(parts[0]) || isNaN(parts[1])) {
		return false
	}
  
	return true
}
  
const entrySchema = new mongoose.Schema({
	name: {type: String, minlength: 3},
	number: {type: String, validate: entryValidator}
})

entrySchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Entry', entrySchema)
