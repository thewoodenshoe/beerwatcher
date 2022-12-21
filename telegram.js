const telegram = require('telegram-bot-api')
const userSettings = require('./credentials')

function sendMsg(msg) {
    let bot = new telegram({
        token: userSettings.telegramData.token
    });
    bot.sendMessage({
        chat_id: userSettings.telegramData.chatid,
        text: msg
    })
        .catch(console.error);
}

module.exports.sendMsg = sendMsg