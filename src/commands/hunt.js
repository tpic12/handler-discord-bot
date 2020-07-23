module.exports = {
  name: "hunt",
  description: "set up a hunt",
  execute(message, embed, args) {
    embed
      .setTitle("User Info")
      .addField("Player Name", message.author.username)
      .addField("Current Server", message.guild.name)
      .setThumbnail(message.author.avatarURL())
      .setColor(0x48c9b0);
    message.channel.send(embed);
  },
};
