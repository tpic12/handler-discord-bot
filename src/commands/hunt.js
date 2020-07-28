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
    let titleMsg = await message.channel.awaitMessages(filter, { max: 1 });
    hunt.desc = titleMsg.first().content;
    message.first().delete();
    //deletes users message
    titleMsg.first().delete();

    message.channel.send("When? h:m am/pm mm/dd");
    let timeMsg = await message.channel.awaitMessages(filter, { max: 1 });
    hunt.time = `${timeMsg.first().content}/2020`;
    message.first().delete();
    //deletes users message
    timeMsg.first().delete();

    let date = new Date(hunt.time);
    hunt.timeMS = countdown(new Date(), date, countdown.MILLISECONDS)
      .toString()
      .split(" ")[0];
    // hunt.timeMS = ms("1 day", "10 hours");

    let hunters =
      hunt.hunters.length > 1 ? hunt.hunters.join(", ") : hunt.hunters;
    embed
      .setTitle("Hunt")
      .addField("Objective:", hunt.desc, true)
      .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
      .addField(`Hunters: 1/4`, hunters)
      .setColor(0xa555bd)
      .setFooter(
        "Created by: " +
          message.author.username +
          " | " +
          moment(date).calendar()
      );

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

          if (reaction.emoji.name === "➕" && hunter.username !== "Handler") {
            HuntService.addHunter(hunter, message, sent);
          }
          if (reaction.emoji.name === "➖" && hunter.username !== "Handler") {
            HuntService.removeHunter(hunter, message, sent);
          }
          if (reaction.emoji.name === "❔" && hunter.username !== "Handler") {
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
