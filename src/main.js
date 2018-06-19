const discord = require('discord.js');
const fs = require("fs");

const discordBot = new discord.Client();
discordBot.logSystem = require('./util/logging.js');
discordBot.logger = discordBot.logSystem.getLogger('Initialisation');

discordBot.commands = new discord.Collection();
let commands = {};

fs.readdir("./src/commands/", (err, dirs) => {
    if (err) console.log(err);

    dirs.forEach((val) => {
        if (fs.statSync(`./src/commands/${val}`).isDirectory()) {
            fs.readdir(`./src/commands/${val}`, (err, files) => {
                let jsFile = files.filter(f => f.split(".").pop() === "js");
                if (jsFile.length <= 0) {
                    discordBot.logger.warn(`Could not find commands in the ${val} category!`);
                } else {
                    let commandLogger = discordBot.logSystem.getLogger("Commands");
                    commandLogger.info(`Loading category ${val}.`);
                    commands[val] = [];

                    jsFile.forEach((f, i) => {
                        let props = require(`./commands/${val}/${f}`);
                        commandLogger.info(`${val}/${f} loaded!`);
                        commands[val].push(props.help.name);
                        discordBot.commands.set(props.help.name, props);
                    });
                }
            });
        }
    });
});

discordBot.on("ready", async () => {
    discordBot.logger = discordBot.logSystem.getLogger(discordBot.user.tag);
    discordBot.logger.info(`Discord ~ Logged in as ${discordBot.user.tag}!`);
});

discordBot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = '!';
    if (!message.content.startsWith(prefix)) return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandFile = discordBot.commands.get(cmd.slice(prefix.length));
    if (commandFile) commandFile.run(discordBot, message, args);
});

discordBot.login('TOKEN');