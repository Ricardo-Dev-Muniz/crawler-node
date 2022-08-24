const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
const cheerio = require("cheerio");
const cors = require("cors");
const CircularJSON = require("circular-json");
const { default: axios } = require("axios");
const { urlencoded } = bodyParser;
((dotenv) = require("dotenv"));

const dotenv = require("dotenv");
const app = express();
admin.initializeApp();

/** 
 * parse for scrap use much memory process 
 * ------
 * base url text and image
 * */
let img = new Array()

app.use(bodyParser.json())
app.use(urlencoded({ extended: true }))
app.use(cors({ origin: true }))


app.get('/', (_req, res, next) => {
  res.render(__dirname+ '/views/index', {
     title: 'API - Phrases random. Wellcome to home!' })
    res.end()
    next()
})
   
app.get('/phrases', (_req, res, next) => {
  scraper(res, next)
})



const url = `${process.env.PENSADOR + topic}`
const image = process.env.PICS
let img = new Array()

app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')

app.use(bodyParser.json())
app.use(urlencoded({ extended: true }))
app.use(cors({ origin: true }))


app.get('/', (_req, res, next) => {
  res.render(__dirname+ '/views/index', {
     title: 'API - Phrases random. Wellcome to home!' })
    res.end()
    next()
})
   
app.get('/phrases', (_req, res, next) => {
  scraper(res, next)
})



/***  --------->
 * image and text get function
 * @imagesQuotes
 * @scrapText
 ***  --------->
 */
function scraper (res, next) {
  new Promise(() => {
    let img_source = []
    let src_data = {}
    const topics = [
      "amor", "saudade", "deus", "dia", "vitoria"
    ]
    var topic = 
    topics[Math.floor(Math.random() * topics.length)];

    const url = `${process.env.PENSADOR + topic}`
    const image = process.env.PICS

    async function fetchData () {
      const result = await axios.get(url)
      const images = await axios.get(image)
      var counter = 0;

      await imagesQutote(images)
      img.forEach(() => { 
        counter++
        feat/random
        if(counter === 10) { 
          var img1 = img[Math.floor(Math.random() * 10)].download_url
          var img2 = img[Math.floor(Math.random() * 5)].download_url
          img_source.push(img1, img2) 
        }

        if(counter <= 10) { img_source.push(src.download_url) }

      })

      src_data = { citation: result.data, image: img_source }
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