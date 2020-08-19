const moment = require("moment-timezone");
const Discord = require("discord.js");
const countdown = require("countdown");
const { MILLISECONDS, SECONDS } = require("countdown");
const embed = new Discord.MessageEmbed();
const re = /^ *([0-1]?[0-9]|[2][0-3]):[0-5][0-9]\s*(a|p|A|P)(m|M)\s*([0]\d|[1][0-2])\/([0-2]\d|[3][0-1])\/([2][01]|[1][6-9])\d{2}$/g;
module.exports = {
  name: "time",
  async execute(message, args) {
    let date = args.slice(1);
    let tz = date.splice(2, 1).join(" ");
    // if (args.length > 4) {
    //   date = new Date(args.slice(1).join(" "));
    // } else {
    //   console.log("making a date string...");
    //   let today = new Date();
    //   let dd = today.getDate();
    //   let mm = today.getMonth() + 1;
    //   let yyyy = today.getFullYear();
    //   date = new Date(args.slice(1).join(" ") + mm + "/" + dd + "/" + yyyy);
    // }
    // let field = {
    //   name: message.author.username,
    //   TS: new Date(message.createdTimestamp),
    //   dateValue: date,
    // };
    // embed
    //   .setTimestamp(date)
    //   .setFooter(`created by: ${message.author.username}`)
    //   .addField("Time", moment(embed.timestamp).format("MMM Do, h:mm a"));
    // // console.log(field);
    // message.channel.send(embed);
    let validDate = re.exec(date.join(" "));
    console.log("regex date: ", date.join(" "));
    console.log("tz: ", tz);
    console.log("display date: ", args.slice(1).join(" "));
    if (validDate) {
      console.log("g2g");
    } else {
      console.log("NOPE");
    }
  },
};
