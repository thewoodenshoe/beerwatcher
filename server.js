const telegram = require('./telegram')
const axios = require('axios')
const fs = require('fs')
let oldValueSP = 1234567890
let oldPayload = ''
let msg = ''
const getUrlSP = async () => {
    try {
        let payload = await axios.get('https://www.sideprojectbrewing.com/search.js?q=handle:*&view=bss.product.labels')
        return payload.data
    } catch (error) {
        console.error(error)
    }
}


const checkBeerSP = async () => {
    try {
        let payload = await getUrlSP()
        let beerID = 6133564080281
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


const checkUpdateSP = async () => {
    try {
        console.log("heartbeat..")
        let payload = await getUrlSP()       
        if (oldPayload != '') { // skip the init
            payload.forEach(function(newkey) { 
                let oldkey = oldPayload.find (item => item.id == newkey.id)
                if (newkey.available != oldkey.available) {
                    msg = 'Availability changed: ' +newkey.handle +' is now:' +newkey.available
                    console.log(msg)
                    telegram.sendMsg(msg)
                }
                if (newkey.inventory != oldkey.inventory) {
                    msg = 'Inventory changed: ' +newkey.handle + 'value from ' +oldkey.inventory + ' to ' +newkey.inventory
                    console.log(msg)
                    telegram.sendMsg(msg)                     
                }
                if (oldkey == null) {
                    msg = 'NEW in store: ' +newkey.handle + ' with available set to:' +newkey.available
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

/******** 
/* MAIN 
*********/
setInterval(checkUpdateSP, 1 * 60 * 1000)
//checkUpdateSP()


//telegram.sendMsg("Starting..")
//checkBeerSP()
//setInterval(checkBeerSP, 1* 5 * 1000)