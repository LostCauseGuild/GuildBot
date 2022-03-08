var conf = {};

conf.discord = {
    token: "Discord Bot Token",
    prefix: "Discord Bot Prefix",

    guildID: "Discord Server ID",
    channelID: "Discord Channel ID",
    logChannel: "Discord Channel ID",
    staffRoleID: "ID of the Staff role",
    memberRoleID: "ID of the Guild Member role",

    webhook: {
        enabled: false,
        id: "Discord Webhook ID",
        token: "Discord Webhook Token"
    } // The Webhook ID is the string of numbers from a webhook URL, whereas the Token is the longer string of letters.
};

// You shouldn't need to change anything that is already defined here.
conf.minecraft = {
    // auth: "microsoft", // Only un-comment if you are using a microsoft account.
    username: "Mojang/Microsoft Email address",
    password: "Account password",
    host: "GuildBot.hypixel.net",
    chatLengthLimit: "256",
    viewDistance: "tiny",
    version: "1.8.9"
};

export default conf;