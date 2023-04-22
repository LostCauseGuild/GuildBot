import {WebhookClient, MessageEmbed} from 'discord.js';
import conf from './config/config.js';
import bridge from './index.js';

const staffWebhook = new WebhookClient({id: conf.discord.staffWebhook.id, token: conf.discord.staffWebhook.token});
const webhook = new WebhookClient({id: conf.discord.webhook.id, token: conf.discord.webhook.token});
const client = bridge.dcBot;
const mc = bridge.mcBot;


mc.on("spawn", async () => {
    await setTimeout(() => {
        console.log("Switching to guild chat. (If not already.)");
        mc.chat("/chat g");
    }, 1000);
    await setTimeout(() => mc.chat("§"), 1500);
    await setTimeout(() => mc.chat("Logged in"), 2000);
    await setTimeout(() => mc.chat("/g online"), 3000);
});

mc.on("messagestr", (msg) => {
    let msgParts = msg.split(" ");
    console.log("Minecraft: ".brightGreen + msg);

    if (msg.includes("●")) {
        let listMsg = msg.split("●");
        for (var k = 0; k < listMsg.length; k++) bridge.onlineMembers = bridge.onlineMembers.concat(listMsg[k].replace(/\[.{1,}\]/g, "").replace(/\s/g, "")).filter(Boolean);
    };

    if (msg.startsWith("Guild >")) {
        if (msgParts[2].includes(mc.username) || msgParts[3].includes(mc.username)) return;
        if (msgParts.length == 4 && !msg.includes(":")) {
            bridge.channel.send(`\`${msgParts[2]}\` ${msgParts[3]}`);
            switch (msgParts[3]) {
                case "joined.":
                    bridge.onlinePlayers++;
                    break;
                case "left.":
                    bridge.onlinePlayers--;
                    break;
            }
        } else {
            let i = msg.indexOf(":");
            let sentMsg = [msg.slice(0, i), msg.slice(i + 1)];
            let sender;
            if (msgParts[2].includes("[")) sender = msgParts[3].replace(":", ""); else sender = msgParts[2].replace(":", "");

            if (conf.discord.webhook.enabled == true) webhook.send({content: `${sentMsg[1]}`, username: `${sender}`, avatarURL: `https://www.mc-heads.net/avatar/${sender}`, allowedMentions: {parse: ["users"]}});
            else {
                let embed = new MessageEmbed({color: 'NAVY', author: {name: `${sender}: ${sentMsg[1]}`, iconURL: `https://www.mc-heads.net/avatar/${sender}`}});
                bridge.channel.send({embeds: [embed]});
            }
        }
    };

    if (msg.startsWith("Officer >")) {
        if (msgParts[2].includes(mc.username) || msgParts[3].includes(mc.username)) return;
        let i = msg.indexOf(":");
        let sentMsg = [msg.slice(0, i), msg.slice(i + 1)];
        let sender;
        if (msgParts[2].includes("[")) sender = msgParts[3].replace(":", ""); else sender = msgParts[2].replace(":", "");

        if (conf.discord.webhook.enabled == true) staffWebhook.send({content: `${sentMsg[1]}`, username: `${sender}`, avatarURL: `https://www.mc-heads.net/avatar/${sender}`, allowedMentions: {parse: ["users"]}});
        else {
            let embed = new MessageEmbed({color: 'NAVY', author: {name: `${sender}: ${sentMsg[1]}`, iconURL: `https://www.mc-heads.net/avatar/${sender}`}});
            bridge.staff.send({embeds: [embed]});
        }
    };

    if (msg.startsWith("Online Members")) bridge.onlinePlayers = msgParts[2];

    if (bridge.onlinePlayers !== bridge.currentPlayers) {
        client.user.setPresence({activities: [{name: `${bridge.onlinePlayers} guild members`, type: 'WATCHING'}], status: 'dnd' });
        bridge.currentPlayers = bridge.onlinePlayers
    };

    if (msg.includes("the guild") && !msg.includes(":")) {
        if (msg.startsWith("[")) var i = 1; else i = 0;

        switch (msgParts[i + 1]) {
            case "joined":
                bridge.channel.send(`\`${msgParts[i]}\` joined the guild.`);
                bridge.logs.send(`\`${msgParts[i]}\` joined the guild.`);
                mc.chat("Welcome " + msgParts[i] + "!");
                bridge.onlinePlayers++;
                break;
            case "left":
                bridge.channel.send(`\`${msgParts[i]}\` left the guild.`);
                bridge.logs.send(`\`${msgParts[i]}\` left the guild.`);
                mc.chat("F");
                bridge.onlinePlayers--;
                break;
            case "was":
                bridge.channel.send(`\`${msgParts[i]}\` was kicked from the guild by \`${msgParts[msgParts.length - 1].replace('!', '.')}`);
                bridge.logs.send(`\`${msgParts[i]}\` was kicked from the guild by \`${msgParts[msgParts.length - 1].replace('!', '.')}`);
                mc.chat("L");
                if (bridge.onlineMembers.includes(msgParts[i])) bridge.onlinePlayers--; 
                break;
        };
    };
    
    if (msg.includes("requested to join")) {
        let msgC = msg.replace('-----------------------------------------------------', '').replace('/\r?\n|\r/g', '').replace('\u000a', '');
        let msgPartsC = msgC.split(' ');
        if (msgC.startsWith("[")) var i = 1; else i = 0;
        if (conf.settings.autoJoin == false) {  
            bridge.logs.send(`<@&${conf.discord.staffRoleID}> \n\`${msgPartsC[i]}\` has requested to join the guild. \nIf you wish to accept them, please type \`${conf.discord.prefix}accept ${msgPartsC[i]}\` in <#${conf.discord.staffChannel}>.`);
            bridge.logs.send(`Once 5 minutes have passed, the join request expires. After that, if you wish for this person to join the guild, please run \`${conf.discord.prefix}invite ${msgPartsC[i]}\` in <#${conf.discord.staffChannel}> to send them another invite.`);
        } else {
            bridge.logs.send(`<@&${conf.discord.staffRoleID}> Autojoin is Enabled. \n\`${msgPartsC[i]}\` requested to join the guild and has been accepted.`);
            mc.chat(`/guild accept ${msgPartsC[i]}`)
        }    
    };

    if (msg.includes("guild" && "Tier" && "Quest") && !msg.includes(":")) {
        bridge.channel.send("The Guild has just completed Tier " + msgParts[9] + " of this week's guild quest! GG!");
        mc.chat("GG!");
    };

    if (msg.includes("Guild" && "Level") && !msg.includes(":")) {
        bridge.channel.send("The Guild has just reached level " + msgParts[msgParts.length - 1].replace('!', '') + " GG!");
        mc.chat("GG!");
    };
});

mc.on("error", (error) => {
    console.warn("Connection lost.");
    console.warn(error);
    setTimeout(() => process.exit(1), 15000);
    if (error === undefined) return;
    bridge.logs.send("Connection lost with error: " + error);
});

mc.on("kicked", (reason) => {
    console.warn("Bot kicked.");
    console.warn(reason);
    setTimeout(() => process.exit(1), 15000);
    if (reason === undefined) return;
    bridge.logs.send("Bot kicked with reason: " + reason);
});

mc.once("end", () => {
    console.warn("Connection ended.");
    setTimeout(() => process.exit(1), 15000);
    bridge.logs.send("Connection ended.");
});