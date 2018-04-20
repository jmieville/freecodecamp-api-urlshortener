var express = require('express')
var bodyParser = require('body-parser')
var validator = require('validator')
var shortid = require('shortid')
var {mongoose} = require('./db/mongoose')

var app = express()
var port = process.env.PORT || 3000
var {URLs} = require('../models/urls')

app.use(bodyParser.urlencoded({ extended: true }))
// post link to shorten
app.get('/', (req, res) => {
  res.send(`Example creation usage: \n
  ${req.headers.host}/https://www.google.com \n
  ${req.headers.host}/http://foo.com:80`)
})
app.get('/*', async (req, res) => {
  var url = req.params[0]
  const doc = await URLs.findOne({
    originalUrl: url
  })
  const shortDoc = await URLs.findOne({
    newUrl: url
  })
  if (doc) {
    res.send({
      'originalUrl': req.headers.host + '/' + doc.originalUrl,
      'newUrl': req.headers.host + '/' + doc.newUrl
    })
  } else if (shortDoc) {
    res.send({
      'originalUrl': req.headers.host + '/' + shortDoc.originalUrl,
      'newUrl': req.headers.host + '/' + shortDoc.newUrl
    })
  } else {
    try {
      if (validator.isURL(req.params[0])) {
        try {
          var newUrlPair = new URLs({
            originalUrl: (req.params[0]),
            newUrl: (shortid.generate())
          })
          newUrlPair.save().then((doc) => {
            res.send({
              'originalUrl': req.headers.host + '/' + doc.originalUrl,
              'newUrl': req.headers.host + '/' + doc.newUrl
            })
          })
        } catch (err) {
          res.status(400).end('There was an error: ', err.message)
        }
      } else {
        res.send('this is not a valid url')
      }
    } catch (err) {
      res.status(400).send('There was an error: ', err.message)
    }
  }
})

app.listen(port, () => {
  console.log('Listening to port' + port)
})
