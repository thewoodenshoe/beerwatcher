const axios = require('axios')
const cheerio = require('cheerio')

const convertStringToObjectArray = str => {
  return eval(str);
}

myUrl = 'https://www.sideprojectbrewing.com/search.js?q=handle:*&view=bss.product.labels'
myValue = '6133564080281'

axios.get(myUrl)
  .then(function (response) {
    payload = eval(response) // convert to json object
    
  
    payload.data.forEach(obj => {
      Object.entries(obj).forEach(([key, value]) => {
        if (value == myValue) {
            console.log(obj)
            //console.log(`${key} ${value}`)
            // console.log(obj.inventory))
            console.log('-------------------')
          }
      })
  })

  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  })