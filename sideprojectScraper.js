const axios = require('axios')

const checkChange = async (id) => {
    try {
        let payload = await axios.get('https://www.sideprojectbrewing.com/search.js?q=handle:*&view=bss.product.labels')
        return payload.data
    } catch (error) {
        console.error(error)
    }
}

module.exports.checkChange = checkChange