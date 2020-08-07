const MonsterIcon = require("../assets/monsterIcons");
const MonsterList = require("../assets/monsters.json");

module.exports = {
  name: "monster",
  description: "search for info on specific monster",
  async execute(message, name, embed, args) {
    // console.log("name: ", name);
    // console.log("has ' : ", name.split("").includes("'"));
    if (name.split("").includes("'") || name.split("").includes("‘")) {
      name = name.replace("‘", " ");
      name = name.replace("'", " ");
    }
    // console.log("new name: ", name);
    // console.log("args: ", args);
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

    // console.log("monsters: ", monsterValue);

    if (!monsterValue.length) {
      return message.reply(
        `Sorry, I can't find that monster in my research notes!`
      );
    }

    let weakness3 = [];
    let weakness2 = [];
    let replaceStr = /&#9733;/;
    // monsterValue.weakness.replace(replaceStr, "⭐");⭐⭐⭐
    monsterValue[0].weakness.forEach((wk) => {
      let item = wk.split(" ");
      console.log(item);
      if (item[1].substring(1, item[1].length - 1) === "⭐⭐⭐") {
        weakness3.push(item[0]);
      } else if (item[1].substring(1, item[1].length - 1) === "⭐⭐") {
        weakness2.push(item[0]);
      }
    });
    console.log("3 star weaknesses: ", weakness3);
    console.log("2 star weaknesses: ", weakness2);
    monsterValue.map((monster) => {
      let searchName = monster.name.toLowerCase().split(" ").join("-");
      let iconURL = MonsterIcon[searchName].icon;

      embed
        .setTitle("**" + monster.name + "**")
        .addField("**Species**", monster.species)
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

//AXIOS API CALL

// try {
//   let getMonster = async () => {
//     // let response = await axios.get(`${api}/monsters?q={"name":"${name}"}`);

//     let response = await axios
//       .get("../assets/monsters.json")
//       .then((res) => res.json())
//       .catch((error) => console.log(error));
//     // .then((res) => res.json())
//     // .then((data) => console.log(data));

//     let monster = response.data;
//     return monster;
//   };
//   let monsterValue = await getMonster();
//   console.log(monsterValue);
// } catch (err) {
//   console.error;
// }
