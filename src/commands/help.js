module.exports = {
  name: "help",
  description: "help embed with commands",
  execute(message, embed, args) {
    embed
      .setTitle("Commands for The Handler!")
      .setDescription("Hey partner! Ready to hunt in the New World?")
      .addField(
        "*monster [monsters name]",
        "Use this command to see all the detiails you want to know about a specific monster! `ex: *monster ruiner nergigante`"
      )
      .addField(
        "*locale [area]",
        "Use this command to see all the monsters that live in that locale of the Guiding Lands organized by threat level! For the area name use the first part of the region. The bold names on the list pertain to area specific tempered monsters, that's not to say they won't appear elsewhere, but are *only* available tempered in that locale. Regions included are: Forest, Wildspire, Coral, Rotted, Volcanic & Tundra. `ex: *locale rotted => Rotted Region, *locale forest => Forest Region`"
      )
      .addField(
        "*hunt [objective]",
        "Use this command to create a new hunt for friends to sign up using message reactions, just follow the prompts and type your answer `ex: *hunt [objective of hunt], [handler question: When? example: 7:35 pm est 07/23/2020 OR 7:35 pm est if today]. Hunters can use the reactions under the message to join, leave, join as an alt, or delete(creator only) the hunt.` *please note the timezone you are in and if daylight savings is in effect, if your times are off by one hour then try edt instead of est, pertaining to your timezone.*"
      );
    console.log(message.author);
    message.author.send(embed);
  },
};
