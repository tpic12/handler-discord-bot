module.exports = {
  name: "monster",
  description: "search for info on specific monster",
  async execute(message, axios, api, name, embed, args) {
    let getMonster = async () => {
      let response = await axios.get(`${api}/monsters?q={"name":"${name}"}`);

      let monster = response.data;
      return monster;
    };
    let monsterValue = await getMonster();
    if (!monsterValue.length) {
      return message.reply(
        `Sorry, I can't find that monster in my research notes!`
      );
    }

    let weakness3 = [];
    let weakness2 = [];
    for (value in monsterValue[0].weaknesses) {
      if (monsterValue[0].weaknesses[value].stars === 3) {
        weakness3.push(monsterValue[0].weaknesses[value].element);
      } else if (monsterValue[0].weaknesses[value].stars === 2) {
        weakness2.push(monsterValue[0].weaknesses[value].element);
      }
    }

    embed
      .setTitle(monsterValue[0].name)
      .addField("Species", monsterValue[0].species)
      .addField("3 Star Weaknesses", weakness3.join(", "))
      .addField("2 Star Weaknesses", weakness2.join(", "))
      .addField("Resistances", monsterValue[0].resistances[0].element)
      .setColor(0x48c9b0);
    message.channel.send(embed);
  },
};
