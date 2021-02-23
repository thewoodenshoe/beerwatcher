const sideprojectScraper = require('./sideprojectScraper')
const telegram = require('./telegram')
sideProjectID = '6133564080281'
let oldValueSP = 1234567890

const checkSideProject = async () => {
    try {
        let newValueSP = await sideprojectScraper.checkChange(sideProjectID)
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

telegram.sendMsg("Starting..")
checkSideProject()
setInterval(checkSideProject, 5* 60 * 1000)
