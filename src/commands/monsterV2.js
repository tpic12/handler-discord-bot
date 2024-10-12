const MonsterIcon = require("../assets/monsterIcons");
const MonsterList = require("../assets/monsters.json");
const axios = require("axios");
const Discord = require("discord.js");

module.exports = {
  name: "monsterV2",
  description: "search for info on specific monster",
  async execute(message, name, game, embed, args) {
    try {
      // Handle special characters in the monster name
      name = name.replace(/[’']/g, " ");

      let monsterValue = [];

      // If the user is searching for all monsters with a matching name
      if (args[1] === "all") {
        MonsterList.forEach((monster) => {
          if (monster.name.toLowerCase().includes(name.toLowerCase())) {
            monsterValue.push(monster);
          }
        });
      } else {
        // Fetch monsters from the API
        const response = await axios.get(
          `${process.env.DEVELOPMENT_ENDPOINT}/${game.toLowerCase()}/monsters`,
          {
            params: { name: name },
          }
        );

        monsterValue = response.data;
      }

      // If no monster is found, send a reply immediately
      if (!monsterValue.length) {
        return message.reply(
          `Sorry, I can't find that monster in my research notes!`
        );
      }

      // Extract weaknesses and other data for the first monster
      const monster = monsterValue[0];
      let weakness3 = [];
      let weakness2 = [];

      monster.weaknesses.forEach((wk) => {
        if (wk.rating === 3) {
          weakness3.push(wk.type.charAt(0).toUpperCase() + wk.type.slice(1));
        } else if (wk.rating === 2) {
          weakness2.push(wk.type.charAt(0).toUpperCase() + wk.type.slice(1));
        }
      });

      // Fallback values for weaknesses if none are found
      if (!weakness3.length) weakness3.push("None");
      if (!weakness2.length) weakness2.push("None");

      let attachment = new Discord.MessageAttachment(
        `./src/assets/localeIcons/huntLogo.png`,
        "huntLogo.png"
      );
      let defaultThumbnail = `attachment://huntLogo.png`;

      let title;
      if (monster.threatLevel !== "none") {
        title = `**${monster.name}**  [${monster.threatLevel}🔥]`;
      } else {
        title = `**${monster.name}**`;
      }
      const locales = monster.locations.map((locale) => locale.name).join(", ");
      const embedIndex = Math.floor(Math.random() * monster.locations.length);
      const embedColor = monster.locations[embedIndex]?.color || "#FFFFFF"; // Default color in case not found
      const searchName = monster.name.toLowerCase().split(" ").join("-");
      const iconURL = MonsterIcon[game.toLowerCase()][searchName]?.icon; // Default icon if not found

      // Construct the embed message
      embed
        .setTitle(title)
        .addField("**Species**", monster.species, true)
        .addField("**Locale**", locales, true)
        .addField("**Weaknesses** ⭐⭐⭐", weakness3.join(", "))
        .addField("**Weaknesses** ⭐⭐", weakness2.join(", "))
        .addField("**Resistances**", monster.resistances.join(", ") || "None")
        .setDescription(monster.usefulInfo || "No additional info available.")
        .setColor(embedColor);

      if (iconURL) {
        embed.setThumbnail(iconURL);
      } else {
        embed.attachFiles(attachment).setThumbnail(defaultThumbnail);
      }

      if (monster.rampageRole) {
        embed.addField("**Rampage Role**", monster.rampageRole);
      }

      // Send the embed message
      message.channel.send(embed);
    } catch (error) {
      console.error("Error fetching monster data:", error);
      message.reply("An error occurred while fetching the monster data.");
    }
  },
};
