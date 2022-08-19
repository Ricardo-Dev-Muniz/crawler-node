const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const cors = require("cors");
const CircularJSON = require("circular-json");
const { default: axios } = require("axios");
const { urlencoded } = bodyParser;
const app = express();
admin.initializeApp();


app.use(bodyParser.json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.get('/citation', (_req, res, next) => {
  scraper(res, next);
});

let img = new Array()

function scraper (res, next) {
  new Promise(() => {
    let img_source = []
    let src_data = {}
    const topics = [
      "amor", "saudade", "deus", "dia", "vitoria"
    ]
    var topic = 
    topics[Math.floor(Math.random() * topics.length)];

    const url = `https://www.pensador.com/${topic}`
    const image = 'https://picsum.photos/v2/list'

    async function fetchData () {
      const result = await axios.get(url)
      const images = await axios.get(image)
      var counter = 0;
      await imagesQutote(images)
      img.forEach((src) => { 
        counter++
        if(counter <= 3) { img_source.push(src.url) }
      })

      src_data = {citation: result.data, image: img_source}
      return src_data.citation
    }
  
    async function scrapQuotes (res) {
      const content = await fetchData()
      const $ = cheerio.load(content)
      
      let counter = 0;
      let trdata = {}
      trdata["data"] = []
      let phrases = []

      $('p.fr').each((_index, quote) => {
         const text = $(quote).text()
         phrases.push(text)
         phrases.forEach((data) => {
          counter++

          var sources = src_data.image[counter-2]
          var tr = {
            page: { citation: data, image: sources }
          };

          if(counter > 1) trdata["data"].push(tr.page)
          if(counter == 3) {
            res.send(trdata.data)
            res.end()
          }
         })
      })
    }

   return scrapQuotes(res)
  }).then(() => {
    next()
  })
}

async function imagesQutote(images) {
  new Promise((resolve) => {
    async function scrapImages () {
    const roundJS = CircularJSON.stringify(images.data);
    img = JSON.parse(roundJS)
    resolve(img)
  }
  scrapImages()

 }).catch((err) => {
   throw(err) 
  })
}

exports.app = functions.https.onRequest(app);
