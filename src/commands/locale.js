const MonsterList = require("../assets/monsters.json");

module.exports = {
  name: "locale",
  description: "Shows list of monsters by locale, and info about locale",
  async execute(message, area, embed, args) {
    let monsters = {
      "Fanged-Beast": [],
      "Fanged-Wyvern": [],
      "Flying-Wyvern": [],
      "Piscine-Wyvern": [],
      "Brute-Wyvern": [],
      "Elder-Dragon": [],
      "Bird-Wyvern": [],
      Relict: [],
    };
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
        switch (species) {
          case "Fanged Beast":
            monsters["Fanged-Beast"].push(monster.name);
            break;
          case "Fanged Wyvern":
            monsters["Fanged-Wyvern"].push(monster.name);
            break;
          case "Brute Wyvern":
            monsters["Brute-Wyvern"].push(monster.name);
            break;
          case "Flying Wyvern":
            monsters["Flying-Wyvern"].push(monster.name);
            break;
          case "Piscine Wyvern":
            monsters["Piscine-Wyvern"].push(monster.name);
            break;
          case "Bird Wyvern":
            monsters["Bird-Wyvern"].push(monster.name);
            break;
          case "Elder Dragon":
            monsters["Elder-Dragon"].push(monster.name);
            break;
          case "Relict":
            monsters.Relict.push(monster.name);
            break;
        }
      }
    });
    Object.keys(monsters).forEach((key) => {
      if (!monsters[key].length) {
        monsters[key].push("None");
        counter++;
      }
      let name = key.split("-").join(" ");
      monsterFields.push({
        name: "**" + name + ": **",
        value: monsters[key].join(", "),
      });
      if (counter > 7) {
        message.reply(`Sorry I can\'t find any monsters in **${args[1]}**`);
      }
    });
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
