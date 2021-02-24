const SPScraper = require('./sideprojectScraper')

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
setInterval(runSP, 1 * 30 * 1000)