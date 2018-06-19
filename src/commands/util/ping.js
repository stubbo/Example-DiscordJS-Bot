module.exports.run = async (bot, message) => {
    message.reply(Math.round(bot.ping));
};
module.exports.help = {
    name: "ping"
};