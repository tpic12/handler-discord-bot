const MonsterList = require("../assets/monsters.json");
const Discord = require("discord.js");

module.exports = {
  name: "locale",
  description: "Shows list of monsters by locale, and info about locale",
  async execute(message, area, embed, args) {
    let monsters = {};
    let areaTitle = "";
    let color = "";
    let iconSrc = "";
    let monsterFields = [];
    let counter = 0;
    let isInArea = (locale) => {
      if (locale.name.toLowerCase().includes(`${area.toLowerCase()} region`)) {
        areaTitle = locale.name;
        color = locale.color;
        if (locale.icon) {
          iconSrc = locale.icon;
        }

        return true;
      }
    };
    let isTempered = (locale) => {
      if (
        locale.tempered &&
        locale.name.toLowerCase().includes(`${area.toLowerCase()} region`)
      ) {
        return true;
      }
      return false;
    };
    MonsterList.forEach((monster) => {
      if (
        monster.locations.some(isInArea) &&
        monster["threat-level"] !== "none"
      ) {
        let threat = monster["threat-level"];
        if (monster.locations.some(isTempered)) {
          if (!monsters[threat]) {
            monsters[threat] = [`**${monster.name}**`];
          } else {
            monsters[threat].push(`**${monster.name}**`);
          }
        } else {
          if (!monsters[threat]) {
            monsters[threat] = [monster.name];
          } else {
            monsters[threat].push(monster.name);
          }
        }
      }
    });
    // console.log(monsters);
    function sortObj(obj) {
      return Object.keys(obj)
        .sort()
        .reverse()
        .reduce(function (result, key) {
          result[key] = obj[key];
          return result;
        }, {});
    }
    let sortedMonsters = sortObj(monsters);
    Object.keys(sortedMonsters).forEach((key) => {
      let name = `Threat Level  ${key}`;
      monsterFields.push({
        name: "**" + name + ": **",
        value: sortedMonsters[key].join(", "),
      });
    });

    if (!Object.keys(sortedMonsters).length) {
      message.reply(`Sorry I can\'t find any monsters in **${args[1]}**`);
    } else {
      let attachment = new Discord.MessageAttachment(
        `./src/assets/localeIcons/${iconSrc}`,
        iconSrc
      );
      let thumbnail = `attachment://${iconSrc}`;
      embed
        .setTitle("**" + areaTitle + "**")
        .addFields(monsterFields)
        .attachFiles(attachment)
        .setThumbnail(thumbnail)
        .setColor(color)
        .setFooter("*Bold names are tempered only in that area");
      if (counter <= 7) {
        message.channel.send(embed);
      }
    }
  },
};
//ADD FIELDS EXAMPLE
// let siege = [
//   { name: "Objective", value: siegeValue[0].successConditions },
//   { name: "Time Left", value: timeLeft },
// ];
// .addFields(siege)

/**
 * species:
 * -Fanged Beast
 * -Fanged Wyvern
 * -Flying Wyvern
 * -Piscine Wyvern
 * -Brute Wyvern
 * -Elder Dragon
 * -Bird Wyvern
 * -Relict
 */
//
