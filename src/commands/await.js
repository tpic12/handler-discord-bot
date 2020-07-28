const { execute } = require("./monster");
const { MessageEmbed } = require("discord.js");
const newEmbed = new MessageEmbed();

module.exports = {
  name: "await",
  description: "testing await reactions",
  async execute(message, embed, args) {
    embed.setTitle("Awaiting...");
    let sent = await message.channel.send(embed);
    const reactions = await sent.awaitReactions((reaction) => {
      // console.log(reaction.users.cache);
      reaction.users.cache.map((user) => console.log(user.username));
      if ((reaction.emoji.name = "➕")) {
        newEmbed.setTitle("This is new content");
        sent.edit(newEmbed);
      }
      // console.log(reaction.emoji.name);
    });
    //   message.channel.send("Collections gathered.");
    //   console.log(reactions.count);
  },
};
