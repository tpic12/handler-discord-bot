const Discord = require("discord.js");
const bot = new Discord.Client();
const { TOKEN } = require("../config");

bot.login(TOKEN);

bot.on("ready", () => {
  console.log("Handler is Online!");
});

bot.on("message", (msg) => {
  if (msg.content[0] === "*") {
    msg.reply("Hello pal!");
  }
});
