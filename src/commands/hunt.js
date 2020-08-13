const { Hunts } = require("../variable");
const HuntService = require("../helpers/hunt-service");
const countdown = require("countdown");
const moment = require("moment");

module.exports = {
  name: "hunt",
  description: "Set up a hunt",
  async execute(message, embed, args) {
    let hunt = {
      id: "",
      server_id: message.guild.id,
      desc: "",
      hunters: [message.author.username],
      huntersId: [message.author.id],
      altHunters: [],
      altHuntersId: [],
      time: "",
      timeMS: "",
    };
    message.channel.send("What do you want to hunt?");
    let filter = (m) => m.author.id === message.author.id;
    let titleMsg = await message.channel.awaitMessages(filter, {
      max: 1,
      dispose: true,
    });
    hunt.desc = titleMsg.first().content;

    message.channel.send("When? `h:m am/pm mm/dd`");
    let timeMsg = await message.channel.awaitMessages(filter, { max: 1 });
    if (timeMsg.first().content.split(" ").length !== 3) {
      message.reply("Incorrect time format, `example: 7:35 pm 07/23`");
    }
    hunt.time = `${timeMsg.first().content.trim()}/2020`;

    // //deletes users message
    // timeMsg.first().delete(500);

    let date = new Date(hunt.time);
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
    hunt.timeMS = countdown(new Date(), date, countdown.MILLISECONDS)
      .toString()
      .split(" ")[0];

    let hunters =
      hunt.hunters.length > 1 ? hunt.hunters.join(", ") : hunt.hunters;
    let member = message.guild.member(message.author);
    let roleIds = member._roles;
    let roles = member.guild.roles.cache
      .filter((r) => roleIds.includes(r.id))
      .map((i) => i.name);

    // console.log("role: ", roleIds);
    // console.log(roles.join(" | "));
    let footer = roles.length
      ? "Created by: " + message.author.username + ` [ ${roles.join(" | ")} ] `
      : "Created by: " + message.author.username;

    embed
      .setTitle("Hunt")
      .addField("Objective:", hunt.desc)
      .addField("Time:", times)
      .addField(`Hunters: 1/4`, hunters)
      .setColor(0xa555bd)
      .setFooter(footer);
    message.channel.bulkDelete(5);
    let sent = await message.channel
      .send(embed)
      .then((sent) => {
        hunt.id = sent.id;
        return sent;
      })
      .then((sent) => {
        Hunts.set(
          message.author.id + " G " + message.guild.name + " M " + sent.id,
          hunt
        );
        setTimeout(() => {
          message.author.send(`${hunt.desc} in 10 minutes`);
        }, hunt.timeMS - 600000);
        setTimeout(() => {
          Hunts.delete(
            message.author.id + " G " + message.guild.name + " M " + sent.id
          );
          sent.delete();
        }, hunt.timeMS);
        return sent;
      })
      .then(async (msg) => {
        for (emoji of ["➕", "➖", "❔"]) await msg.react(emoji);
        return msg;
      })
      .then(async (sent) => {
        const reactions = await sent.awaitReactions((reaction) => {
          //Get hunter info from reaction.blahblahblah
          let hunter = {
            username: "",
            hunterId: "",
          };
          reaction.users.cache.map((user) => {
            hunter.username = user.username;
            hunter.hunterId = user.id;
          });

          if (
            reaction.emoji.name === "➕" &&
            hunter.username !== "Handler" &&
            hunter.username !== "Handler-dev"
          ) {
            HuntService.addHunter(hunter, message, sent);
          }
          if (
            reaction.emoji.name === "➖" &&
            hunter.username !== "Handler" &&
            hunter.username !== "Handler-dev"
          ) {
            HuntService.removeHunter(hunter, message, sent);
          }
          if (
            reaction.emoji.name === "❔" &&
            hunter.username !== "Handler" &&
            hunter.username !== "Handler-dev"
          ) {
            HuntService.addAltHunter(hunter, message, sent);
          }
        });
      })
      .catch(console.error);
  },
};
/**
 * Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
let obj = {}
function addObj(value) {
let id = Math.floor(1000 + Math.random() * 9000);
while(obj[id]){
  console.log('new id for: ', id);
  id = Math.floor(1000 + Math.random() * 9000);
}
console.log(id);
obj[id] = value;
obj.total += 1
}
for(let i=0; i<testStr.length; i++){
  addObj(testStr[i])
}
 */
