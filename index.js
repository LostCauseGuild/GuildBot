import {Client, Intents} from 'discord.js';
import mineflayer from 'mineflayer';
import conf from './config/config.js';
import 'colors';

const bridge = {};
const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_INTEGRATIONS);

bridge.currentPlayers = 0;
bridge.onlineMembers = [];
bridge.onlinePlayers = 0;

bridge.channel = null;
bridge.guild = null;
bridge.staff = null;
bridge.logs = null;

bridge.mcBot = mineflayer.createBot(conf.minecraft);
bridge.dcBot = new Client({autoReconnect: true, intents: myIntents});

export default bridge;

import('./discord.js');
import('./minecraft.js');