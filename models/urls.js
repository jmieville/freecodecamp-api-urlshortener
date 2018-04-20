const mongoose = require('mongoose')
const {isURL} = require('validator')

var UrlSchema = new mongoose.Schema({
  originalUrl: {
    required: true,
    type: String,
    validate: [isURL, 'invalid URL'],
    unique: true
  },
  newUrl: {
    required: true,
    type: String,
    validate: String,
    unique: true
  }
})

var URLs = mongoose.model('URLs', UrlSchema)

module.exports = {URLs}
