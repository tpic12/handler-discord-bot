require("dotenv").config();
const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");

const APPLICABLE_GAMES = ["wilds", "world", "rise"];

bot.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./src/commands/")
  .filter((file) => file.endsWith(".js"));

commandFiles.forEach((file) => {
  try {
    const command = require(`./commands/${file}`);
    if (command.name) {
      bot.commands.set(command.name, command);
    } else {
      console.warn(`Command ${file} is missing a name.`);
    }
  } catch (error) {
    console.error(`Error loading command ${file}:`, error);
  }
});

["server"].forEach((handler) => {
  require(`./${handler}`)(bot);
});
const devBotToken = process.env.DEV_BOT_TOKEN || process.env.BOT_TOKEN;
bot.login(devBotToken).catch((error) => {
  console.error("Failed to log in:", error);
});

bot.on("ready", () => {
  console.log("Handler is Online!");
});

bot.on("message", async (message) => {
  const PREFIX = "*"; // Define a constant for the command prefix
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  let args = message.content.split(" ");
  let embed = new Discord.MessageEmbed();
  let game = args[1];
  switch (args[0]) {
    case `*time`:
      bot.commands.get("time").execute(message, args);
      break;
    case `*hunt`:
      if (!args[1]) return message.reply("Please specify monster to hunt");
      bot.commands.get("hunt").execute(message, embed, args);
      break;
    case `*monster`:
      if (!APPLICABLE_GAMES.includes(args[1]))
        return message.reply("Please specify game to monsters");
      let name = args.slice(2).join(" ");
      if (!args[2]) return message.reply("Please specify monster to search");

      bot.commands.get("monsterV2").execute(message, name, game, embed, args);
      break;
    case `*help`:
      bot.commands.get("help").execute(message, embed, args);
      break;
    // case `*siege`:
    //   bot.commands
    //     .get("siege")
    //     .execute(message, axios, API_ENDPOINT, embed, args);
    //   break;
    case `*locale`:
      if (!APPLICABLE_GAMES.includes(args[1]))
        return message.reply("Please specify game to monsters");
      if (!args[2] || args[2].toLowerCase() == "the" || args[2].length < 4)
        return message.reply("Please specify a locale to search!");
      let area = args.slice(2).join(" ");
      bot.commands.get("localeV2").execute(message, area, game, embed, args);
      break;
  }
});
