const SPScraper = require('./sideprojectScraper')

const runSP = async () => {
    try {
        console.log("Heartbeat..")
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
runSP()
setInterval(runSP, 5 * 60 * 1000)