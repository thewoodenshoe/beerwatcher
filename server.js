const SPScraper = require('./sideprojectScraper')
const telegram = require('./telegram')
const axios = require('axios')
const fs = require('fs')


const runSP = async () => {
    try {
        let payload = await SPScraper.downloadURL()
        SPScraper.runCompare(payload)
    } 
     catch (error) {
       console.error(error)
    }
}

/******** 
/* MAIN 
*********/
console.log("start..")
setInterval(runSP, 1 * 5 * 1000)