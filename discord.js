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
                case `${bot.prefix}online`:
                    bridge.onlineMembers = [];
                    mc.chat("/g online");
                    setTimeout(() => bridge.channel.send("The currently online guild members are: " + bridge.onlineMembers), 2000);
                    break;
                case `${bot.prefix}accept`:
                    if (message.member.roles.cache.get(`${bot.staffRoleID}`)) {
                        mc.chat(`/guild accept ${msgParts[1]}`);
                    } else {
                        bridge.channel.send("Error: Only Staff can accept members.");
                    };
                    break;
            };
        } else mc.chat(message.member.displayName + ": " + message.content);
    // } else {
    //     if ((message.content.includes("member role") || message.content.includes("lost role")) && !message.member.roles.cache.get(bot.memberRoleID)) message.reply("If you're a member of the guild, send GuildB0t a message on Hypixel with your discord tag to recieve the member role!"); break;
    //     if ((message.content.includes("apply") || message.content.includes("join")) && message.content.includes("guild")) message.reply("You can apply to join the guild on the Hypixel Forum thread! You can fine it here: https://hypixel.net/threads/4480870"); break;
    //     if ((message.content.includes("smp") || message.content.includes("ip") || message.content.includes("minecraft server")) && message.content.includes("guild")) {
    //         if (message.channel.id == ("797842642440028180") || message.channel.id == ("802278805838102539")) {
    //             message.reply("Check the Pinned messages to find the Server IP and any version/mod requirements!"); break;
    //         } else message.reply("Head to <#797842642440028180>!"); break;
        // };
    };
});

client.login(bot.token);