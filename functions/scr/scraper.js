class Scraper {
    constructor (text) {
      this.url = `https://www.pensador.com/${text.data}`,
      this.image = 'https://picsum.photos/v2/list'
    }
  
    async fetchData () {
      const result = await axios.get(this.url)
      return result.data
    }
  
    async scrapQuotes (res, next) {
      const content = await this.fetchData()
      const $ = cheerio.load(content)
      
      let count = 0;
      let trdata = {}
      trdata["data"] = []

      let phrases = []
      $('p.fr').each((_index, quote) => {
         const text = $(quote).text()
         phrases.push(text)
      })

      phrases.forEach((data) => {
        count++;
        var jsonString = {
            Page: {
                citation: data
            }
        };

        trdata["data"].push(jsonString.Page);

        if(count === 6) {
            res.json(trdata.data);
            next()
        }
      })
      return phrases
    }
  
    async getQuotes () {
      const x = await this.scrapQuotes()
      return x
    }
}

function simpleStringify (object){
  var simpleObject = {};
  for (var prop in object ){
      if (!object.hasOwnProperty(prop)){
          continue;
      }
      if (typeof(object[prop]) == 'object'){
          continue;
      }
      if (typeof(object[prop]) == 'function'){
          continue;
      }
      simpleObject[prop] = object[prop];
  }
  return JSON.stringify(simpleObject); 
};