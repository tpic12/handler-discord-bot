const countdown = require("countdown");
const MonsterIcon = require("../assets/monsterIcons");
// const attachment = new Discord.Attachment("../assets/mhw-logo.png", "logo.png");
// const attachment = new Discord.MessageAttachment().setFile(
//   "../assets/logo.png",
//   "logo"
// );

module.exports = {
  name: "siege",
  description: "sends info on current siege, with start and end time.",
  async execute(message, axios, api, embed, args) {
    let getMonster = async () => {
      let siege;
      try {
        let responseSafi = await axios.get(
          `${api}/event?q={"type":"safi'jiiva siege","platform":"console"}`
        );
        console.log("safi: ", responseSafi.data);
        siege = responseSafi.data;
      } catch (e) {
        console.error(e.message);
      }
      try {
        let responseKulve = await axios.get(
          `${api}/events?q={"type":"kulve taroth siege","platform":"console"}`
        );
        siege = responseKulve.data;
        return siege;
      } catch (e) {
        console.error(e.message);
      }

      return siege;
    };
    let siegeValue = await getMonster();
    if (!siegeValue.length) {
      return message.reply(`Sorry, I can't find a siege going on right now!`);
    }

    let endTime = siegeValue[0].endTimestamp.slice(0, 10).split("-");
    // console.log(endTime[1]);
    //~countdown.MINUTES & (add this for exclusion of minutes in countdown)
    let timeLeft = countdown(
      new Date(),
      new Date(endTime[0], endTime[1] - 1, endTime[2]),
      ~countdown.SECONDS & ~countdown.MILLISECONDS
    ).toString();
    let color = siegeValue[0].type.includes("kulve") ? 0xd9b338 : 0xbf3834;
    let siege = [
      { name: "Objective", value: siegeValue[0].successConditions },
      { name: "Time Left", value: timeLeft },
    ];

    embed
      .setTitle(siegeValue[0].name)
      .addFields(siege)
      .setColor(color)
      .setThumbnail(
        "https://gamepedia.cursecdn.com/monsterhunterworld_gamepedia_en/e/ed/MHW_Kulve_Taroth_Icon.png?version=42dcc532daec682a323f14464f83fa48"
      );
    message.channel.send(embed);
  },
};
