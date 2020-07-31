const moment = require("moment-timezone");
const Discord = require("discord.js");
const embed = new Discord.MessageEmbed();
module.exports = {
  name: "test",
  async execute(message, args) {
    // let getJoke = async () => {
    //   let response = await axios.get(
    //     "https://official-joke-api.appspot.com/random_joke"
    //   );
    //   let joke = response.data;
    //   return joke;
    // };
    // let jokeValue = await getJoke();
    let est = moment(new Date(hunt.time))
      .tz("America/new_york")
      .format("M/D dd h:mma z");
    let cst = moment(new Date(hunt.time))
      .tz("America/indiana/tell_city")
      .format("M/D dd h:mma z");
    let mst = moment(new Date(hunt.time))
      .tz("America/denver")
      .format("M/D dd h:mma z");
    let pst = moment(new Date(hunt.time))
      .tz("America/los_angeles")
      .format("M/D dd h:mma z");
    let times = [est, cst, mst, pst];
    let fields = [
      { name: "Author:", value: message.author.username },
      { name: "Start Time: ", value: times },
    ];
    embed.setTitle("TIMES").addFields(fields);
    message.channel.send(embed);
  },
};
