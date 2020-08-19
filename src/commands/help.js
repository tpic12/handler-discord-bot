module.exports = {
  name: "help",
  description: "help embed with commands",
  execute(message, embed, args) {
    embed
      .setTitle("Commands for The Handler!")
      .setDescription(
        "The Handler is a bot for Discord to help you hunt in the New World!"
      )
      .addField(
        "*monster [monsters name]",
        "Use this command to see all the detiails you want to know about a specific monster! `ex: *monster ruiner nergigante`"
      )
      .addField(
        "*locale [area]",
        "Use this command to see all the monsters that live in that locale organized by species! For the area name use any word that is in the area name. `ex: *locale rotten => Rotten Vale, *locale forest => The Ancient Forest`"
      )
      .addField(
        "*hunt",
        "Use this command to create a new hunt for friends to sign up using message reactions, just follow the prompts and type your answer `ex: *hunt [objective of hunt], [handler question: When? example: 7:35 pm est 07/23/2020 OR 7:35 pm est if today]. Hunters can use the reactions under the message to join, leave, join as an alt, or delete(creator only) the hunt.`"
      );
    message.author.send(embed);
  },
};
