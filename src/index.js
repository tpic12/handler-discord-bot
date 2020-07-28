require("dotenv").config();
const Discord = require("discord.js");
const bot = new Discord.Client();
// const { API_ENDPOINT } = require("../config");
const fs = require("fs");
const PREFIX = "*";

bot.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./src/commands/")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  bot.commands.set(command.name, command);
}
["server"].forEach((handler) => {
  require(`./${handler}`)(bot);
});

bot.login(process.env.BOT_TOKEN);

bot.on("ready", () => {
  console.log("Handler is Online!");
});

bot.on("message", async (message) => {
  let args = message.content.substring(PREFIX.length).split(" ");
  let embed = new Discord.MessageEmbed();

  switch (args[0]) {
    case "hunt":
      bot.commands.get("hunt").execute(message, embed, args);
      break;
    case "monster":
      let name = args.slice(1).join(" ");
      if (!args[1]) return message.reply("Please specify monster to search");

      bot.commands.get("monster").execute(message, name, embed, args);
      break;
    case "help":
      bot.commands.get("help").execute(message, embed, args);
      break;
    case "locale":
      if (!args[1] || args[1].toLowerCase() == "the")
        return message.reply("Please specify a locale to search!");
      let area = args.slice(1).join(" ");
      bot.commands.get("locale").execute(message, area, embed, args);
      break;
  }
});
