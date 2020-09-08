const MonsterList = require("../assets/monsters.json");

module.exports = {
  name: "locale",
  description: "Shows list of monsters by locale, and info about locale",
  async execute(message, area, embed, args) {
    let monsters = {};
    let areaTitle = "";
    let color = "";
    let monsterFields = [];
    let counter = 0;
    let isInArea = (locale) => {
      if (locale.name.toLowerCase().includes(area.toLowerCase())) {
        areaTitle = locale.name;
        color = locale.color;
        return true;
      }
    };
    MonsterList.forEach((monster) => {
      if (monster.locations.some(isInArea)) {
        let species = monster.species;
        if (!monsters[species]) {
          monsters[species] = [monster.name];
        } else {
          monsters[species].push(monster.name);
        }
      }
    });
    function sortObj(obj) {
      return Object.keys(obj)
        .sort()
        .reduce(function (result, key) {
          result[key] = obj[key];
          return result;
        }, {});
    }
    let sortedMonsters = sortObj(monsters);
    Object.keys(sortedMonsters).forEach((key) => {
      let name = key.split("-").join(" ");
      monsterFields.push({
        name: "**" + name + ": **",
        value: sortedMonsters[key].join(", "),
      });
    });

    if (!Object.keys(sortedMonsters).length) {
      message.reply(`Sorry I can\'t find any monsters in **${args[1]}**`);
    } else {
      embed
        .setTitle("**" + areaTitle + "**")
        .addFields(monsterFields)
        .setThumbnail(
          "https://github.com/JoseTorralba/MHW-Monster-List/blob/master/img/locale/map_icon.png?raw=true"
        )
        .setColor(color);
      if (counter <= 7) {
        message.channel.send(embed);
      }
    }
  },
};
//ADD FIELDS .addFields(siege)
// let siege = [
//   { name: "Objective", value: siegeValue[0].successConditions },
//   { name: "Time Left", value: timeLeft },
// ];
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
