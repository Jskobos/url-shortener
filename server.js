const express = require('express')
const mongo   = require('mongodb').MongoClient;
const app     = express()
const port    = process.env.PORT || 3000
const dblink  = 'mongodb://codecamp:cinnaboncascade@ds133290.mlab.com:33290/urls'

app.get('/', (req,res) => {
  res.send("Submit a url: /new/http://www.example.com")
})

app.get('/new/*', (req,res) => {
  let url = req.originalUrl.slice(5)
  let short_url = makeid(5)
  let entry = { original_url: url, short_url: short_url }
  mongo.connect(dblink, (err, db) => {
    if (err) { console.error(err) }
    var urls = db.collection('urls')
    urls.find({
      'original_url': url
    },{
      original_url: true,
      short_url: true,
      _id: false
    }).limit(1).next((err,doc) => {
      db.close()
      if (err) { console.error(err) }
      else if (doc) { res.json(doc) }
      else { insertEntry(entry, res) }
    })
  })
})

app.get('/:url', (req,res) => {
  mongo.connect(dblink, (err, db) => {
    if (err) { console.error(err) }
    var urls = db.collection('urls')
    urls.find({
      'short_url': req.params.url
    },{
      original_url: true
    }).limit(1).next((err,doc) => {
      if (err) { console.error(err) }
      else if (doc) { res.redirect(doc.original_url) }
      else { res.redirect('/') }
      db.close()
    });
  });
})

app.listen(port, () => console.log('Express app listening on port ' + port))

function makeid(idLength)
{
    let text = ""
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for( var i=0; i < idLength; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length))

    return text
}

function insertEntry(entry, res) {
  let inserted = JSON.parse(JSON.stringify(entry))
  mongo.connect(dblink, (err, db) => {
    if (err) { console.error(err) }
    var urls = db.collection('urls')
    urls.insert(entry, function(err,docs) {
      if (err) {
        console.error(err)
        inserted.short_url = makeid(5)
        newEntry = JSON.parse(JSON.stringify(inserted))
        insertRecord(newEntry, res)
      }
      res.json(inserted)
      db.close()
    });
  });
}
