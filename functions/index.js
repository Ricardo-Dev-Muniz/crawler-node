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

function scraper (res, next) {
  new Promise(() => {
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
      const img = imagesQutote(images)
      return result.data
    }
  
    async function scrapQuotes (res) {
      const content = await fetchData()
      const $ = cheerio.load(content)
      
      let count = 0;
      let trdata = {}
      trdata["data"] = []
      let phrases = []

      $('p.fr').each((_index, quote) => {
         const text = $(quote).text()
         phrases.push(text)
         phrases.forEach((data) => {
          count++

          var tr = {
            page: { citation: data }
          };

          if(count > 1) trdata["data"].push(tr.page)
          if(count == 3) res.send(trdata.data);
         })
      })
    }

   return scrapQuotes(res)
  }).then(() => {
    next()
  })
}

async function imagesQutote(images) {
  new Promise(() => {
    async function scrapImages () {
    const roundJS = CircularJSON.stringify(images.data);
    const img = JSON.parse(roundJS)
    return img
  }
   scrapImages()
 })
}

exports.app = functions.https.onRequest(app);