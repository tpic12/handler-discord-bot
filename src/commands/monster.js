const MonsterIcon = require("../assets/monsterIcons");
const MonsterList = require("../assets/monsters.json");

module.exports = {
  name: "monster",
  description: "search for info on specific monster",
  async execute(message, name, embed, args) {
    if (name.split("").includes("'") || name.split("").includes("’")) {
      name = name.replace("’", " ");
      name = name.replace("'", " ");
    }
    let monsterValue = [];
    if (args[1] == "all") {
      MonsterList.forEach((monster) => {
        if (monster.name.toLowerCase().includes(name.toLowerCase())) {
          monsterValue.push(monster);
        }
      });
    } else {
      MonsterList.forEach((monster) => {
        if (monster.name.toLowerCase() == name.toLowerCase()) {
          monsterValue.push(monster);
        }
      });
    }
    if (!monsterValue.length) {
      return message.reply(
        `Sorry, I can't find that monster in my research notes!`
      );
    }

    let weakness3 = [];
    let weakness2 = [];
    monsterValue[0].weakness.forEach((wk) => {
      let item = wk.split(" ");
      if (item[1].substring(1, item[1].length - 1) === "⭐⭐⭐") {
        weakness3.push(item[0]);
      } else if (item[1].substring(1, item[1].length - 1) === "⭐⭐") {
        weakness2.push(item[0]);
      }
    });
    let title;
    if (monsterValue[0]["threat-level"] !== "none") {
      title =
        "**" +
        monsterValue[0].name +
        "**" +
        "  " +
        monsterValue[0]["threat-level"];
    } else {
      title = "**" + monsterValue[0].name + "**";
    }

    if (!weakness3.length) {
      weakness3.push("None");
    }
    if (!weakness2.length) {
      weakness2.push("None");
    }
    let locales = monsterValue[0].locations
      .map((locale) => locale.name)
      .join(", ");
    monsterValue.map((monster) => {
      let searchName = monster.name.toLowerCase().split(" ").join("-");
      let iconURL = MonsterIcon[searchName].icon;

      embed
        // .setTitle("**" + monster.name + "**")
        .setTitle(title)
        .addField("**Species**", monster.species, true)
        .addField("**Locale**", locales, true)
        .addField("**Weaknesses** ⭐⭐⭐", weakness3.join(", "))
        .addField("**Weaknesses** ⭐⭐", weakness2.join(", "))
        .addField("**Resistances**", monster.resistances.join(", "))
        .setDescription(monster.useful_info)
        .setThumbnail(iconURL)
        .setColor(0x48c9b0);
      message.channel.send(embed);
    });
  },
};
