const MonsterList = require("../assets/monsters.json");
const monster = require("./monster");

module.exports = {
  name: "locale",
  description: "Shows list of monsters by locale, and info about locale",
  async execute(message, area, embed, args) {
    console.log("Area: ", area);
    let monsters = [];
    let areaTitle = "";
    let color = "";
    let isInArea = (locale) => {
      if (locale.name.toLowerCase().includes(area.toLowerCase())) {
        areaTitle = locale.name;
        color = locale.color;
        return true;
      }
    };
    MonsterList.forEach((monster) => {
      if (monster.locations.some(isInArea)) {
        monsters.push(monster.name);
      }
    });
    console.log("color: ", color);
    embed
      .setTitle("**" + areaTitle + "**")
      .addField("**Monsters in Area**", monsters.join(", "))
      .setColor(color);
    message.channel.send(embed);
  },
};
