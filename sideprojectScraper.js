const telegram = require('./telegram')
const axios = require('axios')
const fs = require('fs')

let msg = ''
let oldPayload = ''
let errorDownloading = false

// The tags for checking
let tagBeer = false
let tagGiftCard = false
let tagGratuity = false
let tagUnlocked = false
let tagMemberOnly = false
let oldTagUnlocked = false
let tagProceed = false

// earning
let totalMadeDD = 0
let totalMadeMM = 0
let totalMadeDDMM = 0
let saleprice = 0

const downloadURL = async () => {
    try {
        let payload = await axios.get('https://www.sideprojectbrewing.com/search.js?q=handle:*&view=bss.product.labels')
        return payload.data
    } catch (error) {
        console.error(error)
        errorDownloading = true
    }
}

const runCompare = async (payload, flagChangedDay, flagChangeMonth) => {
    try {
        // download a new json format into payload
        errorDownloading = false
        let payload = await downloadURL() 
        if (oldPayload != '' && errorDownloading == false) { // skip the init or if the download failed
            payload.forEach(function(newkey) {
                // reset per loop
                oldkey = oldPayload.find (item => item.id == newkey.id)
                tagBeer = false
                tagGiftCard = false
                tagGratuity = false
                tagMemberOnly = false
                tagUnlocked = false
                oldTagUnlocked = false
                tagProceed = true

                // Go over all the tags and set the values
                if (newkey.tags != null) {
                    tagBeer = JSON.stringify(newkey.tags).includes("Beer")
                    tagGiftCard = JSON.stringify(newkey.tags).includes("Gift Card")
                    tagGratuity = newkey.handle == 'gratuity'
                    tagMemberOnly = JSON.stringify(newkey.tags).includes("La Coterie")
                    tagUnlocked = JSON.stringify(newkey.tags).includes("UNLOCKED")
                    
                    // Only proceed if it's beer related. No need for member only items, or gratitude, etc.
                    if ( ! tagBeer || tagGiftCard || tagGratuity || tagMemberOnly) {
                        tagProceed = false
                    }
                }
                if (oldkey != undefined) {
                    oldTagUnlocked = JSON.stringify(oldkey.tags).includes("UNLOCKED")
                    // Check if the oldkey is locked
                    if (tagUnlocked && oldTagUnlocked == false) {
                        console.log('old id: ' +oldkey.id +". tags: " +oldkey.tags)
                        console.log('new id: ' +newkey.id +". tags: " +newkey.tags)
                    }
                    // Informational, check all the inventory changes and show it on the terminal.
                    if (newkey.inventory != oldkey.inventory && ! tagGiftCard && ! tagGratuity) {
                        saleprice = ((oldkey.inventory - newkey.inventory) * (newkey.price/100))
                        totalMadeDD = (totalMadeDD + saleprice)
                        totalMadeDDMM = (totalMadeMM + totalMadeDD)
                        msg = 'Inventory changed: ' +newkey.handle + '. Sold: ' +(oldkey.inventory - newkey.inventory) 
                                +'. Inventory from ' +oldkey.inventory + ' to ' +newkey.inventory 
                                +'. Money made: $' + saleprice +'. Todays aggregate: ' +totalMadeDD + '. Month aggregate: ' +totalMadeDDMM
                        console.log(msg)
                    }
                }
                
                // Only proceed if it's beer related. Skip the nonsense
                if (tagProceed) {
                    // New beer added!
                    if (oldkey == undefined && newkey != null) {
                        // new beer is unlocked and set to available
                        if (tagUnlocked && newkey.available) {
                            msg = 'New beer ('+newkey.handle +') for sale!!! Inventory: ' +newkey.inventory +'. Price: ' +newkey.price/100 
                                +'. https://www.sideprojectbrewing.com/collections/beer/products/' +newkey.handle                            
                        }
                        else {
                            msg = 'Beer added in store ('+newkey.handle +') but not for sale yet (url might not work). This beer will be available soon! Inventory: ' +newkey.inventory +'. Price: ' +newkey.price/100 +'. Publish at: ' + newkey.publish_at
                                + '. https://www.sideprojectbrewing.com/collections/beer/products/' +newkey.handle
                        }
                        console.log(msg)
                        telegram.sendMsg(msg)
                    }
                
                    // The beer was made but he changed the tags from hidden to available
                    else if ((newkey.available && oldkey.available == false && tagUnlocked)) { 
                        msg = 'Beer ' +newkey.handle +' is now available for purchase. Inventory: ' +newkey.inventory +'. Price: ' +newkey.price/100 
                            + '. https://www.sideprojectbrewing.com/collections/beer/products/' +newkey.handle
                        console.log(msg)
                        console.log('Tag available was the switch')
                        telegram.sendMsg(msg)
                    }
                    else if (tagUnlocked && oldTagUnlocked == false && newkey.available) {
                        msg = 'Beer ' +newkey.handle +' is now available for purchase. Inventory: ' +newkey.inventory +'. Price: ' +newkey.price/100 
                            + '. https://www.sideprojectbrewing.com/collections/beer/products/' +newkey.handle
                        console.log(msg)
                        telegram.sendMsg(msg)
                        console.log ('Tag Unlock was the switch')
                    }
                } // tagProceed
            }) // loop
            // Money/ sales
            if (flagChangedDay) {
                totalMadeMM = totalMadeMM + totalMadeDD
                console.log('it is end of day, SP made: ' +totalMadeDD +'. Month aggregate: ' +totalMadeMM)
                today = new Date()
                todayDD = today.getDate()
                fs.appendFileSync('./money.log', 'New day ' +todayDD +'. Income yesterday: ' +totalMadeDD +"\n")
                totalMadeDD = 0
            }
            if (flagChangeMonth) {
                msg = 'Fun fact: End of month earnings: $' +totalMadeMM
                today = new Date()
                todayMM = today.getMonth()
                fs.appendFileSync('./money.log', 'New month ' +todayMM +'. Previous month: ' +totalMadeMM +"\n")
                //    telegram.sendMsg(msg)
                totalMadeMM = 0
                totalMadeDDMM = 0
            }
        }
        oldPayload = payload
    }
    catch (error) {
        console.error(error)
        oldPayload = payload
    }
}

module.exports.downloadURL = downloadURL
module.exports.runCompare = runCompare