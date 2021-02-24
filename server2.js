const telegram = require('./telegram')
const axios = require('axios')
let oldValueSP = 1234567890


const getUrlSP = async (id) => {
    try {
        let payload = await axios.get('https://www.sideprojectbrewing.com/search.js?q=handle:*&view=bss.product.labels')
        return payload.data
    } catch (error) {
        console.error(error)
    }
}

const CheckBeerSP = async () => {
    try {
        let beerID = 6133564080281
        let payload = await getUrlSP(beerID)
        let arrFound = payload.find (item => item.id == beerID)
        let newValueSP = arrFound.inventory
        console.dir(arrFound)
        console.log('inventory: ' +typeof(arrFound.inventory))
        console.log("Heartbeep. New value: " +newValueSP +". Old value: " +oldValueSP)
        if ((oldValueSP != newValueSP) & (oldValueSP != 1234567890)) {
            telegram.sendMsg("Ambiente sale went from " +oldValueSP +" to " +newValueSP)
            console.log("Ambiente went from " +oldValueSP +" to " +newValueSP)
        }
        oldValueSP = newValueSP
    } 
     catch (error) {
       console.error(error)
    }
}


//telegram.sendMsg("Starting..")
//CheckBeerSP()
setInterval(CheckBeerSP, 1* 5 * 1000)
