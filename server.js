const SPScraper = require('./sideprojectScraper')

let today = new Date()
let todayDD = today.getDate()
let todayDDprev = today.getDate()
let todayMM = today.getMonth()
let todayMMprev = today.getMonth()
let flagChangedDay = false
let flagChangeMonth = false
const runSP = async () => {
    try {
        today = new Date()
        todayDD = today.getDate()
        todayMM = today.getMonth()
        console.log("Heartbeat.." +today)
        if (todayDD != todayDDprev){
            flagChangedDay = true
            console.log('I think we changed days! todayDD: ' +todayDD +". Yesterday: " +todayDDprev +'. today: ' +today)
        } 
        if (todayMM != todayMMprev) {
            flagChangeMonth = true
            console.log('I think we changed month! todayMM: ' +todayMM +". Yesterday: " +todayMMprev +'. today: ' +today)
        } 
        let payload = await SPScraper.downloadURL()
        SPScraper.runCompare(payload, flagChangedDay, flagChangeMonth)
        flagChangedDay = false
        flagChangeMonth = false
        todayDDprev = todayDD
        todayMMprev = todayMM
    } 
    catch (error) {
       console.error(error)
    }
}

/******** 
/* MAIN 
*********/
console.log("start.. ")
runSP()
setInterval(runSP, 30 * 1 * 1000)