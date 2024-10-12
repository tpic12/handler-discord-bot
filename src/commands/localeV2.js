const Discord = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "localeV2",
  description: "Shows list of monsters by locale, and info about locale",

  async execute(message, area, game, embed, args) {
    try {
      // Fetch locale and monster data from API
      const response = await axios.get(
        `${process.env.DEVELOPMENT_ENDPOINT}/${game.toLowerCase()}/locales`,
        {
          params: {
            locale: area.toLowerCase(),
            filter: { by_threat_level: true },
          },
        }
      );

      const { monsterList: monsterLocaleData, localeObject } = response.data;
      const { name: areaTitle, color, icon: iconSrc = "" } = localeObject;

      if (!Object.keys(monsterLocaleData).length) {
        return message.reply(
          `Sorry, I can't find any monsters in **${args[1]}**`
        );
      }

      // Format tempered monsters with bold names
      for (const threatLevel in monsterLocaleData) {
        monsterLocaleData[threatLevel].forEach((monster) => {
          if (monster.tempered) {
            monster.name = `**${monster.name}**`;
          }
        });
      }

      // Sort monsters by threat level (highest first)
      const sortedMonsters = Object.keys(monsterLocaleData)
        .sort((a, b) => b - a)
        .reduce((acc, key) => {
          acc[key] = monsterLocaleData[key];
          return acc;
        }, {});

      // Build monster fields for embed
      const monsterFields = Object.entries(sortedMonsters).map(
        ([threatLevel, monsters]) => ({
          name: `**Threat Level ${"🔥".repeat(threatLevel)}**`,
          value: monsters.map((monster) => monster.name).join(", "),
        })
      );

      // Prepare and send embed message
      const iconAttachment = new Discord.MessageAttachment(
        `./src/assets/localeIcons/${iconSrc}`,
        iconSrc
      );

      let defaultAttachment = new Discord.MessageAttachment(
        `./src/assets/localeIcons/huntLogo.png`,
        "huntLogo.png"
      );
      let defaultThumbnail = `attachment://huntLogo.png`;

      embed
        .setTitle(`**${areaTitle}**`)
        .addFields(monsterFields)
        .setColor(color)
        .setFooter("*Bold names are tempered only in that area");

      if (iconSrc) {
        embed
          .attachFiles(iconAttachment)
          .setThumbnail(`attachment://${iconSrc}`);
      } else {
        embed.attachFiles(defaultAttachment).setThumbnail(defaultThumbnail);
      }

      message.channel.send(embed);
    } catch (error) {
      console.error(error);
      message.reply("Sorry, there was an error retrieving the locale data.");
    }
  },
};
