const express = require('express');
const parser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const server = express();

server.use(parser.json());
server.use(express.static('client/build'));
server.use(parser.urlencoded({extended: true}));

MongoClient.connect('mongodb://localhost:27017', function(err, client) {
  if(err) {
    console.log(err);
    return;
  }
  const db = client.db("whisky");
  console.log("Connect to databse");

  server.post('/api/whiskys', function(req, res) {
    db.collection('whiskys').insert(req.body, function(err, result) {
      if(err) {
        console.log(err);
        res.status(500);
        res.send();
        return;
      }
      console.log('Saved to database');
      res.status(200);
      res.json(result.ops[0]);
    });
  });

  server.get('/api/whiskys', function(req, res) {
    db.collection('whiskys').find().toArray(function(err, result) {
      if(err) {
        console.log(err);
        res.status(500);
        res.send();
        return;
      }
      res.json(result);
    });
  });


  server.listen(3000, function() {
    console.log("Listeneing on port 3000");
  })
});
