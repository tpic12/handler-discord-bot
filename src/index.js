require("dotenv").config();
const Discord = require("discord.js");
const countdown = require("countdown");
const moment = require("moment");
const axios = require("axios");
const bot = new Discord.Client();
const { API_ENDPOINT } = require("../config");
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

bot.login(process.env.BOT_TOKEN);

bot.on("ready", () => {
  console.log("Handler is Online!");
});

bot.on("messageReactionAdd", (reaction, user) => {
  if (reaction.emoji.name === "➕") {
    console.log(reaction.users);
  }
});

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
      let hunt = {
        title: "",
        time: "",
        hunters: [message.author.username],
      };
      message.channel.send("What do you want to hunt?");

      let filter = (m) => m.author.id === message.author.id;
      let titleMsg = await message.channel.awaitMessages(filter, { max: 1 });
      hunt.title = titleMsg.first().content;
      message.channel.send("When?");
      let timeMsg = await message.channel.awaitMessages(filter, { max: 1 });
      hunt.time = `${timeMsg.first().content}/2020`;

      let date = new Date(hunt.time);

      // console.log(moment(date).calendar());
      let hunters =
        hunt.hunters.length > 1 ? hunt.hunters.join(", ") : hunt.hunters;
      embed
        .setTitle("Hunt")
        .addField("Monster:", hunt.title, true)
        .addField("Time:", hunt.time, true)
        .addField("Hunters:", hunters)
        .setFooter(
          "Created by: " +
            message.author.username +
            " | " +
            moment(date).calendar()
        );
      message.channel
        .send(embed)
        .then(async (msg) => {
          const filter = (reaction, user) => {
            return (
              reaction.emoji.name === "➕" ||
              reaction.emoji.name === "➖" ||
              reaction.emoji.name === "❔"
            );
          };
          const collector = message.createReactionCollector(filter);
          // collector.on("collect", (reaction, user) => {
          //   console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
          // });
          for (emoji of ["➕", "➖", "❔"]) await msg.react(emoji);
        })
        .catch(console.error);
      break;
    case "monster":
      let name = args.slice(1).join(" ");
      if (!args[1]) return message.reply("Please specify monster to search");
      bot.commands
        .get("monster")
        .execute(message, axios, api, name, embed, args);
      break;
    case "siege":
      bot.commands.get("siege").execute(message, axios, api, embed, args);
      break;
  }
});
