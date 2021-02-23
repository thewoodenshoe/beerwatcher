const telegram = require('telegram-bot-api')
const userSettings = require('./credentials')
let messageTxt = 'hello'
let bot = new telegram({
    token: userSettings.telegramData.token
});

bot.sendMessage({
    chat_id: userSettings.telegramData.chatid,
    text: messageTxt})
.then(console.log)
.catch(console.error)