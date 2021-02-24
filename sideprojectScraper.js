const telegram = require('./telegram')
const axios = require('axios')

let oldInventory = ''
let oldHandle = ''
let oldLockStatus = ''
let oldPayload = ''
let msg = ''

const downloadURL = async () => {
    try {
        let payload = await axios.get('https://www.sideprojectbrewing.com/search.js?q=handle:*&view=bss.product.labels')
        return payload.data
    } catch (error) {
        console.error(error)
    }
}

const runCompare = async (payload) => {
    try {
        console.log("heartbeat..")
        //let payload = await downloadURL()       
        if (oldPayload != '') { // skip the init
            payload.forEach(function(newkey) { 
                let oldkey = oldPayload.find (item => item.id == newkey.id)

                if (newkey.available != oldkey.available) {
                    msg = 'Availability changed: ' +newkey.handle +' is now:' +newkey.available
                    console.log(msg)
                    telegram.sendMsg(msg)
                }
                if (newkey.inventory != oldkey.inventory) {
                    msg = 'Inventory changed: ' +newkey.handle + '. from ' +oldkey.inventory + ' to ' +newkey.inventory
                    console.log(msg)
                    telegram.sendMsg(msg)                     
                }
                if (oldkey == null) {
                    msg = 'NEW in store: ' +newkey.handle + '. Available set to:' +newkey.available
                    console.log(msg)
                    telegram.sendMsg(msg)
                }
                if (JSON.stringify(newkey.tags) != (JSON.stringify(oldkey.tags))) {
                    msg = 'TAGS Changed for ' +newkey.handle +": " + JSON.stringify(newkey.tags)
                    console.log(msg)
                    telegram.sendMsg(msg)
                }
           })
        }
        oldPayload = payload
    }
    catch (error) {
       console.error(error)
       oldPayload = eval(payload)
    }
}

module.exports.downloadURL = downloadURL
module.exports.runCompare = runCompare