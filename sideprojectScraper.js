const axios = require('axios')

const checkChange = async (id) => {
    try {
        let payload = await axios.get('https://www.sideprojectbrewing.com/search.js?q=handle:*&view=bss.product.labels')
 //       let arrFound = payload.data.find(function(item) {
 //           return item.id == id
 //       })
     let arrFound = payload.data.find (item => item.id == id)
     return arrFound.inventory
    } catch (error) {
        console.error(error)
    }
}

module.exports.checkChange = checkChange
