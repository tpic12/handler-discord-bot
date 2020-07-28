require("dotenv").config();
const Discord = require("discord.js");
const axios = require("axios");
const bot = new Discord.Client();
const { API_ENDPOINT } = require("../config");
const fs = require("fs");
const PREFIX = "*";
const { Hunts } = require("./variable");

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

// bot.on("messageReactionAdd", (reaction, user) => {
//   let id = reaction.users.reaction.message.id;
//   if (reaction.users.reaction.message.author.bot) {
//     console.log(reaction.users[1]);
//   }

//   // if (
//   //   reaction.emoji.name === "➕" &&
//   //   !reaction.users.reaction.message.author.bot &&
//   //   !Hunts[id].huntersId.include(message.author.id)
//   // ) {
//   //   console.log("adding hunter...");
//   //   // console.log(reaction.users.reaction.message.id);
//   //   // // Hunts[id].hunters.push(message.author.username);
//   //   // // Hunts[id].huntersId.push(message.author.id);
//   // }
//   // if (
//   //   reaction.emoji.name === "➖" &&
//   //   !reaction.users.reaction.message.author.bot &&
//   //   Hunts[id].huntersId.include(message.author.id)
//   // ) {
//   //   console.log("removing hunter...");
//   // }
// });

bot.on("message", async (message) => {
  let args = message.content.substring(PREFIX.length).split(" ");
  let api = API_ENDPOINT;
  let embed = new Discord.MessageEmbed();

  switch (args[0]) {
    case "hunt":
      // let filter = (m) => !m.author.bot;
      // let collector = new Discord.MessageCollector(message.channel, filter, {
      //   max: 2,
      // });
      bot.commands.get("hunt").execute(message, embed, args);
      break;
    case "monster":
      let name = args.slice(1).join(" ");
      if (!args[1]) return message.reply("Please specify monster to search");
      // if (args[1] == "all") {
      //   if (!args[2]) {
      //     return message.reply("Please specify monster to search");
      //   }
      //   name = args.slice(2).join(" ");
      //   // console.log("name w/ all: ", name);
      // } else {
      //   name = args.slice(1).join(" ");
      //   // console.log("name w/o all: ", name);
      // }

      bot.commands.get("monster").execute(message, name, embed, args);
      break;
    case "siege":
      bot.commands.get("siege").execute(message, axios, api, embed, args);
      break;
    case "locale":
      if (!args[1] || args[1].toLowerCase() == "the")
        return message.reply("Please specify a locale to search!");
      let area = args.slice(1).join(" ");
      bot.commands.get("locale").execute(message, area, embed, args);
      break;
    case "await":
      bot.commands.get("await").execute(message, embed, args);
      break;
  }
});
