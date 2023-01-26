import conf from './config/config.js';
import bridge from './index.js'

const client = bridge.dcBot;
const bot = conf.discord;
const mc = bridge.mcBot;

client.on("ready", async () => {
    console.log("Discord: Logged in.".bgBlue);
    bridge.guild = await client.guilds.fetch(bot.guildID);
    bridge.channel = bridge.guild.channels.cache.get(bot.channelID);
    bridge.logs = bridge.guild.channels.cache.get(bot.logChannel);
    bridge.channel.send("Logged In.");
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    let msgParts = message.content.split(' ');

    if (message.channel.id == bot.channelID){
        console.log("Discord: ".blue + `${message.member.displayName} (User: ${message.author.username}): ${message.content}`);

        if (message.content.startsWith(bot.prefix)) {
            switch (msgParts[0]) {
                case `${bot.prefix}online` || `${bot.prefix}list`:
                    bridge.onlineMembers = [];
                    mc.chat("/g online");
                    setTimeout(() => bridge.channel.send("The currently online guild members are: `" + bridge.onlineMembers + "`"), 2000);
                    break;
                case `${bot.prefix}accept`:
                    if (message.member.roles.cache.get(`${bot.staffRoleID}`)) {
                        mc.chat(`/guild accept ${msgParts[1]}`);
                    } else {
                        bridge.channel.send("Error: Only Staff can accept members.");
                    };
                    break;
                case `${bot.prefix}invite`:
                    if (message.member.roles.cache.get(`${bot.staffRoleID}`)) {
                        mc.chat(`/guild invite ${msgParts[1]}`);
                    } else {
                        bridge.channel.send("Error: Only Staff can invite members.");
                    };
                    break;
            };
        } else mc.chat(message.member.displayName + ": " + message.content);
    };
});

client.login(bot.token);