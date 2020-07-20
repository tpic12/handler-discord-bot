const Discord = require("discord.js");
const bot = new Discord.Client();
const { TOKEN } = require("../config");
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

bot.on("message", (message) => {
  let args = message.content.substring(PREFIX.length).split(" ");

  switch (args[0]) {
    case "ping":
      bot.commands.get("ping").execute(message, args);
      break;
    case "site":
      message.channel.send("http://www.taylorpiccarreto.com");
      break;
    case "info":
      if (args[1] === "version") {
        message.channel.send(`Version ${version}`);
      } else {
        message.channel.send(`${args[1]} is not a valid command`);
      }
      break;
    case "embed":
      const embed = new Discord.MessageEmbed()
        .setTitle("User Info")
        .addField("Player Name", message.author.username)
        .addField("Version", version)
        .addField("Current Server", message.guild.name)
        .setThumbnail(message.author.avatarURL())
        .setColor(0x48c9b0);
      message.channel.send(embed);
      break;
  }
});
