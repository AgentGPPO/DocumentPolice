require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction
  ]
});
const FORBIDDEN_WORDS = require('./blocked.json');

client.on("ready", () => {
  console.log("I'm online!");
  client.user.setActivity({
    name: "no avoiding the automod",
    type: "PLAYING"
  });
});

client.on("messageCreate", async(message) => {
  for (const attachment of message.attachments) {
    if (attachment[1].contentType.startsWith("text/plain")) {
      let content = await (await fetch(attachment[1].url)).text();
      for (const forbiddenWord of FORBIDDEN_WORDS) {
        if (content.includes(forbiddenWord)) {
          await message.delete();
          await message.channel.send({
            content: `Dear ${message.author.tag}\nPlease do not share such words`
          });
        }
      }
    }
  }
});

client.login(process.env.TOKEN)
