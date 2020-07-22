const countdown = require("countdown");

module.exports = {
  name: "siege",
  description: "sends info on current siege, with start and end time.",
  async execute(message, axios, api, embed, args) {
    console.log("********************");
    let getMonster = async () => {
      let siege;
      try {
        let responseSafi = await axios.get(
          `${api}/event?q={"type":"safi'jiiva siege","platform":"console"}`
        );
        console.log("safi: ", responseSafi.data);
        siege = responseSafi.data;
      } catch (e) {
        console.log(e.message);
      }
      try {
        let responseKulve = await axios.get(
          `${api}/events?q={"type":"kulve taroth siege","platform":"console"}`
        );
        siege = responseKulve.data;
        return siege;
      } catch (e) {
        console.log(e.message);
      }

      return siege;
    };
    let siegeValue = await getMonster();
    if (!siegeValue.length) {
      return message.reply(`Sorry, I can't find a siege going on right now!`);
    }

    let endTime = siegeValue[0].endTimestamp.slice(0, 10).split("-");
    // console.log(endTime[1]);
    let timeLeft = countdown(
      new Date(),
      new Date(endTime[0], endTime[1] - 1, endTime[2]),
      ~countdown.MINUTES & ~countdown.SECONDS & ~countdown.MILLISECONDS
    ).toString();
    let siege = [
      { name: "Objective", value: siegeValue[0].successConditions },
      { name: "Time Left", value: timeLeft },
    ];
    embed.setTitle(siegeValue[0].name).addFields(siege).setColor(0x48c9b0);
    message.channel.send(embed);
  },
};
