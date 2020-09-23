const { Hunts } = require("../variable");
const HuntService = require("../helpers/hunt-service");
const countdown = require("countdown");
const moment = require("moment");
const Discord = require("discord.js");
const fullDateRegExp = /^([0-1]?[0-9]|[2][0-3]):[0-5][0-9]\s*(a|p|A|P)(m|M)*\s(\w{3})\s([0]\d|[1][0-2])\/([0-2]\d|[3][0-1])\/([2][01]|[1][6-9])\d{2}$/g;
const timeRegExp = /^([0-1]?[0-9]|[2][0-3]):[0-5][0-9]\s*(a|p|A|P)(m|M)*\s(\w{3})$/g;
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

    let filter = (m) => m.author.id === message.author.id;

    hunt.desc = args.slice(1).join(" ");

    message.channel.send(
      "When? `h:m am/pm tz mm/dd/yyyy` or if today `h:m am/pm tz`"
    );
    let timeMsg = await message.channel.awaitMessages(filter, { max: 1 });

    //error handling with RegExp for date and time format
    let proposedTime = timeMsg.first().content;
    let tz = proposedTime.split(" ")[2];
    let fullDate = fullDateRegExp.exec(proposedTime);
    let partialDate = timeRegExp.exec(proposedTime);

    if (!fullDate && !partialDate) {
      message.reply(
        "Incorrect time format, `example: 7:35 pm est 07/23/2020 or 7:35 pm est if today`"
      );
    } else {
      let formattedDate;
      let displayDate;
      if (fullDate) {
        //no formatting necessary
        formattedDate = new Date(proposedTime);
        let tempDate = proposedTime.split(" ");
        // console.log("tempdate: ", tempDate[3]);
        let d = moment(new Date(tempDate[3])).format("MMM Do, ddd");
        displayDate = `${d} ${tempDate.splice(0, 3).join(" ")}`;
      } else if (partialDate) {
        //format with todays date
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        formattedDate = new Date(proposedTime + mm + "/" + dd + "/" + yyyy);
        let d = moment(new Date(mm + "/" + dd + "/" + yyyy)).format(
          "MMM Do, ddd"
        );
        displayDate = `${d} ${proposedTime}`;
      }
      hunt.time = displayDate;

      hunt.timeMS = countdown(new Date(), formattedDate, countdown.MILLISECONDS)
        .toString()
        .split(" ")[0];

      let hunters =
        hunt.hunters.length > 1 ? hunt.hunters.join(", ") : hunt.hunters;
      let member = message.guild.member(message.author);
      let roleIds = member._roles;
      let roles = member.guild.roles.cache
        .filter((r) => roleIds.includes(r.id))
        .map((i) => i.name);

      let footer = roles.length
        ? "Created by: " +
          message.author.username +
          ` [ ${roles.join(" | ")} ] `
        : "Created by: " + message.author.username;
      let attachment = new Discord.MessageAttachment(
        `./src/assets/localeIcons/huntLogo.png`,
        "huntLogo.png"
      );
      let thumbnail = `attachment://huntLogo.png`;

      embed
        .setTitle("Hunt")
        .addField("Objective:", hunt.desc)
        //edit times to just be argument that user gave, edit example to include tz's like charlamagne
        .addField("Time:", `${hunt.time}`)
        .addField(`Hunters: 1/4`, hunters)
        .attachFiles(attachment)
        .setThumbnail(thumbnail)
        .setColor(0xa555bd)
        .setTimestamp(formattedDate)
        .setFooter(footer);
      message.channel.bulkDelete(2);
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
          //sends warning to team about hunt 10 minutes prior to hunt
          setTimeout(() => {
            HuntService.messageHunters(message, sent);
          }, hunt.timeMS - 600000);
          //deletes hunt message in channel when hunt starts
          setTimeout(() => {
            Hunts.delete(
              message.author.id + " G " + message.guild.name + " M " + sent.id
            );
            sent.delete();
          }, hunt.timeMS);
          return sent;
        })
        .then(async (msg) => {
          for (emoji of ["✅", "❌", "❔", "💀"]) await msg.react(emoji);
          return msg;
        })
        .then(async (sent) => {
          const reactions = await sent.awaitReactions((reaction) => {
            //Get hunter info from reaction
            let hunter = {
              username: "",
              hunterId: "",
            };
            reaction.users.cache.map((user) => {
              hunter.username = user.username;
              hunter.hunterId = user.id;
            });

            if (
              reaction.emoji.name === "✅" &&
              hunter.username !== "Handler" &&
              hunter.username !== "Handler-dev"
            ) {
              HuntService.addHunter(
                hunter,
                message,
                sent,
                formattedDate,
                attachment,
                thumbnail
              );
            }
            if (
              reaction.emoji.name === "❌" &&
              hunter.username !== "Handler" &&
              hunter.username !== "Handler-dev"
            ) {
              HuntService.removeHunter(
                hunter,
                message,
                sent,
                formattedDate,
                attachment,
                thumbnail
              );
            }
            if (
              reaction.emoji.name === "❔" &&
              hunter.username !== "Handler" &&
              hunter.username !== "Handler-dev"
            ) {
              HuntService.addAltHunter(
                hunter,
                message,
                sent,
                formattedDate,
                attachment,
                thumbnail
              );
            }
            if (
              reaction.emoji.name === "💀" &&
              hunter.username !== "Handler" &&
              hunter.username !== "Handler-dev" &&
              hunter.username === message.author.username
            ) {
              HuntService.deleteHunt(message, sent);
            }
          });
        })
        .catch(console.error);
    }
  },
};
