var conf = {};

conf.discord = {
    token: "Discord Bot Token",
    prefix: "Discord Bot Prefix",

    guildID: "Discord Server ID",
    channelID: "Discord Channel ID", // Channel for chats to be sent/received in.
    logChannel: "Discord Channel ID", // Channel for logging bot errors, and guild join/leaves.
    staffChannel: "Discord Channel ID", // Channel for Officer chats to be sent/recieved in.
    staffRoleID: "ID of the Staff role",
    memberRoleID: "ID of the Guild Member role",

    webhook: {
        enabled: false,
        id: "Discord Webhook ID",
        token: "Discord Webhook Token"
    }, // The Webhook ID is the string of numbers from a webhook URL, whereas the Token is the longer string of letters.

    staffWebhook: {
        enabled: false,
        id: "Discord Webhook ID",
        token: "Discord Webhook Token"
    } // The Webhook ID is the string of numbers from a webhook URL, whereas the Token is the longer string of letters.
};

// You shouldn't need to change any of this.
conf.minecraft = {
    auth: "microsoft", 
    username: "Microsoft Email address",
    password: "Account password",
    host: "GuildBot.hypixel.net",
    chatLengthLimit: "256",
    viewDistance: "tiny",
    version: "1.8.9"
};

conf.settings = {
    autoJoin: false
};

export default conf;