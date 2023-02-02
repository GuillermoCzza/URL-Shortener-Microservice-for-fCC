require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//connect to MongoDB and setup the url model
const MONGO_URI = process.env['MONGO_URI'];
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
    unique: true,
  },
  short_url: {
    type: Number,
    required: true,
    unique: true,
  }
});

let Url = mongoose.model('Url', urlSchema);

//handle GET request with short url to redirect the user
app.get("/api/shorturl/:short_url", (req, res) => {

  function isNumeric(str) {
    return /^-?\d+$/.test(str);
  }

  let shorturl = req.params.short_url;
  //Only attempt this if short_url is a number to prevent MongoDB throwing an error
  if(isNumeric(shorturl)){
    shorturl = parseInt(shorturl);
    Url.findOne({short_url: shorturl}, (err, data) => {
    if (err) return console.error(err);
    if (data != null){
      //redirect to stored original_url
      res.redirect(data.original_url);
    } else {
      res.sendStatus(404);
    }
  });  
  }
  
  
});


// handle POST request with original url to shorten in body using body parser
app.use("/api/shorturl", bodyParser.urlencoded({extended: false}))
  .post("/api/shorturl", (req, res) => {

    let originalurl = req.body.url;
    
    //check that it's a valid url and stop if it isn't
    if(!/^(http(s)?:\/\/(www.)?)/.test(originalurl)){
      res.json({ error: 'invalid url' });
      return;
    }

    //if originalurl ends in a "/", remove it to having more than one entry for the same URL
    if(originalurl.charAt(originalurl.length - 1) == "/"){
      originalurl = originalurl.slice(0, -1);
    }
    
    
    //Check if URL already exists in database
    Url.findOne({original_url:originalurl}, (err, foundDoc) => {
      if (err) return console.error(err);
      if (foundDoc == null){
        
        //If it doesn't exist
        //count number of documents (saved shortened URLs)
        Url.count({}, (err, counted) => {
          if (err) return console.error(err);
          
          //create new document with input as original_url
          //and (document count + 1) as its short_url
          const jsonReply = {original_url: originalurl, short_url: (counted + 1)};
          Url.create(jsonReply);
          res.json(jsonReply);
        });
      } else {
        
        //If it exists
        const jsonReply = {original_url: foundDoc.original_url, short_url: foundDoc.short_url};
        res.json(jsonReply);
      }
    });
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
