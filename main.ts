import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  Partials,
} from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
  ],
});

const FORBIDDEN_WORDS = JSON.parse(Deno.readTextFileSync("./blocked.json"));

client.on(Events.ClientReady, () => {
  console.log("I'm online!");
  client.user?.setActivity("no avoiding the automod", {
    type: ActivityType.Playing,
  });
});

client.on(Events.MessageCreate, async (message) => {
  for (const [, attachment] of message.attachments) {
    if (attachment.contentType && attachment.contentType.startsWith("text/plain")) {
      const content = await (await fetch(attachment.url)).text();
      for (const forbiddenWord of FORBIDDEN_WORDS) {
        if (content.includes(forbiddenWord)) {
          await message.delete();
          await message.channel.send({
            content:
              `Dear ${message.author.tag}\nPlease do not share such words`,
          });
        }
      }
    }
  }
});

client.login(Deno.env.get("TOKEN"));
