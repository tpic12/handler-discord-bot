const Discord = require("discord.js");
const axios = require("axios");
const bot = new Discord.Client();
const { TOKEN, API_ENDPOINT } = require("../config");
const fs = require("fs");
const PREFIX = "*";
const version = "1.0.0";

bot.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./src/commands/")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  bot.commands.set(command.name, command);
}

bot.login(TOKEN);

bot.on("ready", () => {
  console.log("Handler is Online!");
});

bot.on("message", async (message) => {
  let args = message.content.substring(PREFIX.length).split(" ");
  let api = API_ENDPOINT;
  let embed = new Discord.MessageEmbed();

  switch (args[0]) {
    case "ping":
      bot.commands.get("ping").execute(message, args);
      break;
    case "site":
      message.channel.send("http://www.taylorpiccarreto.com");
      break;
    case "embed":
      bot.commands.get("embed").execute(message, embed);
      break;
    case "joke":
      bot.commands.get("joke").execute(message, axios, args);
      break;
    case "monster":
      let name = args.slice(1).join(" ");
      if (!args[1]) return message.reply("Please specify monster to search");
      bot.commands
        .get("monster")
        .execute(message, axios, api, name, embed, args);
  }
});
