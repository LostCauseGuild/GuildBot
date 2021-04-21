const mineflayer = require("mineflayer");
const discord = require("discord.js");
const config = require("./config/config.json");
const options = require("./config/minecraft.json");
const bot = require("./config/discord.json");
require("colors");

const client = new discord.Client({
    autoReconnect: true
});
const webhookClient = new discord.WebhookClient(bot.webhookID, bot.webhookToken);

// Start Discord Bot
client.on("ready", () => {
    console.log("Discord: Logged in.".bgBlue);
    client.guilds.get(bot.guildID).channels.get(bot.channelID).send("Logged In.");
});

var currentPlayers = 0;
var onlinePlayers = 0;
var onlineMembers = [];

// Start Minecraft Bot
let mc = mineflayer.createBot(options);

mc.on("login", () => {

    setTimeout(() => {
        console.log("Switching to guild chat. (If not already.)");
        mc.chat("/chat g");
    }, 1000);
    setTimeout(() => {
        mc.chat("Logged in");
    }, 2000);
    setTimeout(() => {
        mc.chat("/g online");
    }, 3000);
    setTimeout(() => {
        console.log("Sending to limbo.");
        // mc.chat("/achat \u00a7c<3");
    }, 4000);
});

// Minecraft > Discord
mc.on("message", (chatMsg) => {
    const msg = chatMsg.toString();
    let msgParts = msg.split(" ");
    // console.log("Minecraft: ".brightGreen + msg);

    if (msg.includes("●")) {
        let listmsg = msg.split("●");

        for (k = 0; k < listmsg.length; k++) {
            console.log(listmsg[k].replace(/\s/g, ""));
            onlineMembers = onlineMembers.concat(listmsg[k].replace(/\[.{1,}\]/g, "").replace(/\s/g, ""));
        };
        console.log(onlineMembers)
    } // each line is new message so it resets the variable each time, but does seem able to record each name

    if (msg.startsWith("Guild >")) {
        if (msgParts[2].includes(mc.username) || msgParts[3].includes(mc.username)) return;
        if (msgParts.length == 4 && !msg.includes(":")) {
            client.guilds.get(bot.guildID).channels.get(bot.channelID).send(msgParts[2] + " " + msgParts[3]);
            switch (msgParts[3]) {
                case "joined.":
                    onlinePlayers++
                    break;
                case "left.":
                    onlinePlayers--
                    break;
            }
        } else {
            let i = msg.indexOf(":");
            let sentMsg = [msg.slice(0, i), msg.slice(i + 1)];
            let sender;
            if (msgParts[2].includes("[")) {
                sender = msgParts[3].replace(":", "");
            } else {
                sender = msgParts[2].replace(":", "");
            }

            if (config.useWebhook == true) {
                webhookClient.send(sentMsg[1], {
                    disableEveryone: config.mentionEveryone,
                    username: sender,
                    avatarURL: 'https://www.mc-heads.net/avatar/' + sender,
                });
            } else {
                let embed = new discord.RichEmbed()
                    .setAuthor(sender + ": " + sentMsg[1], "https://www.mc-heads.net/avatar/" + sender)
                    .setColor("GREEN");
                client.guilds.get(bot.guildID).channels.get(bot.channelID).send(embed);
            }
        }
    }

    if (msg.startsWith("Online Members")) {
        onlinePlayers = msgParts[2];
    }

    if (onlinePlayers !== currentPlayers) {
        client.user.setPresence({
            status: "online", //You can show online, idle....
            game: {
                name: onlinePlayers + " guild members", //The message shown
                type: "WATCHING" //PLAYING: WATCHING: LISTENING: STREAMING:
            }
        });
        currentPlayers = onlinePlayers
    }

    // Join/Leave Messages
    if (msg.includes("the guild") && !msg.includes(":")) {
        var i;
        if (msg.startsWith("[")) {
            i = 1;
        } else {
            i = 0;
        }

        switch (msgParts[i + 1]) {
            case "joined":
                client.guilds.get(bot.guildID).channels.get(bot.logChannel).send(msgParts[i] + " joined the guild.");
                mc.chat("Welcome " + msgParts[i] + "!");
                break;
            case "left":
                client.guilds.get(bot.guildID).channels.get(bot.logChannel).send(msgParts[i] + " left the guild.");
                mc.chat("F");
                break;
            case "was":
                client.guilds.get(bot.guildID).channels.get(bot.logChannel).send(msgParts[i] + " was kicked from the guild by " + msgParts[msgParts.length - 1].replace('!', '.'));
                mc.chat("L");
                break;
        }
    }
});

// Error Handling

mc.on("error", (error) => {
    console.log("Connection lost.");
    console.log(error);
    client.guilds.get(bot.guildID).channels.get(bot.logChannel).send("Connection lost with error: " + error);
    setTimeout(()=> {
        process.exit(1);
    }, 5000);
});

mc.on("kicked", (reason) => {
    console.log("Bot kicked.");
    console.log(reason);
    client.guilds.get(bot.guildID).channels.get(bot.logChannel).send("Bot kicked with reason: " + reason);
    setTimeout(()=> {
        process.exit(1);
    }, 5000);
});

mc.once("end", (error) => {
    console.log("Connection ended.");
    console.log(error);
    client.guilds.get(bot.guildID).channels.get(bot.logChannel).send("Connection ended with error: " + error);
    setTimeout(()=> {
        process.exit(1);
    }, 5000);
});


// Discord > Minecraft
client.on("message", (message) => {
    if (message.channel.id !== bot.channelID || message.author.bot) return;
    console.log("Discord: ".blue + message.author.username + ": " + message.content);
    mc.chat(client.guilds.get(bot.guildID).member(message.author).displayName + ": " + message.content);

    let msgParts = message.content.split(' ');
    if (message.content.startsWith(config.prefix)) {
        switch (msgParts[0]) {
            case "-online":
                mc.chat("/gonline")
                client.guilds.get(bot.guildID).channels.get(bot.channelID).send("The currently online guild members are: " + onlineMembers.replace(",", " "))
                onlineMembers = []
                break;
            case "-logout":
                process.exit(0);
        }
    }
});

client.login(bot.token);