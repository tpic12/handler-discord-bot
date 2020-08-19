const { Hunts } = require("../variable");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");

const HuntService = {
  removeHunter(hunter, message, sent) {
    const removeHunterEmbed = new MessageEmbed();
    let hunt = Hunts.get(
      message.author.id + " G " + message.guild.name + " M " + sent.id
    );
    // console.log("OG: ", hunt);
    let newHunterArr = hunt.hunters.filter(
      (name) => name !== hunter.username || name === "N/A"
    );
    let newAltArr = hunt.altHunters.filter((name) => name !== hunter.username);
    let newHunterId = hunt.huntersId.filter((id) => id !== hunter.hunterId);
    let newAltIdArr = hunt.altHuntersId.filter((id) => id !== hunter.hunterId);
    hunt.hunters = newHunterArr;
    hunt.altHunters = newAltArr;
    hunt.huntersId = newHunterId;
    hunt.altHuntersId = newAltIdArr;

    if (!hunt.hunters.length) hunt.hunters.push("N/A");
    Hunts.set(
      message.author.id + " G " + message.guild.name + " M " + sent.id,
      hunt
    );

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
    let size = hunt.hunters.includes("N/A") ? "0" : hunt.hunters.length;
    console.log("party size: ", size);
    if (!hunt.altHunters.length) {
      removeHunterEmbed
        .setTitle("Hunt")
        .addField("Objective:", hunt.desc)
        // .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
        .addField("Time:", times)
        .addField(`Hunters: ${size}/4`, hunt.hunters)
        .setColor(0xa555bd)
        .setFooter(
          "Created by: " +
            message.author.username +
            " | " +
            moment(date).calendar()
        );
    } else {
      removeHunterEmbed
        .setTitle("Hunt")
        .addField("Objective:", hunt.desc)
        // .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
        .addField("Time:", times)
        .addField(`Hunters: ${size}/4`, hunt.hunters, true)
        .addField("Alternates:", hunt.altHunters, true)
        .setColor(0xa555bd)
        .setFooter(
          "Created by: " +
            message.author.username +
            " | " +
            moment(date).calendar()
        );
    }

    sent.edit(removeHunterEmbed);
  },
  addHunter(hunter, message, sent) {
    const addHunterEmbed = new MessageEmbed();
    let hunt = Hunts.get(
      message.author.id + " G " + message.guild.name + " M " + sent.id
    );
    let size = hunt.hunters.includes("N/A") ? "0" : hunt.hunters.length;
    console.log("party size: ", size);

    if (
      hunt.huntersId.includes(hunter.hunterId) ||
      hunt.altHuntersId.includes(hunter.hunterId) ||
      size > 3
    ) {
    } else {
      hunt.hunters.push(hunter.username);
      let newHunterArr = hunt.hunters.filter((name) => name !== "N/A");
      hunt.hunters = newHunterArr;
      hunt.huntersId.push(hunter.hunterId);
      Hunts.set(
        message.author.id + " G " + message.guild.name + " M " + sent.id,
        hunt
      );
      size = hunt.hunters.length;
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

      if (!hunt.altHunters.length) {
        addHunterEmbed
          .setTitle("Hunt")
          .addField("Objective:", hunt.desc)
          // .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
          .addField("Time:", times)
          .addField(`Hunters: ${size}/4`, hunt.hunters)
          .setColor(0xa555bd)
          .setFooter(
            "Created by: " +
              message.author.username +
              " | " +
              moment(date).calendar()
          );
      } else {
        addHunterEmbed
          .setTitle("Hunt")
          .addField("Objective:", hunt.desc)
          // .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
          .addField("Time:", times)
          .addField(`Hunters: ${size}/4`, hunt.hunters, true)
          .addField("Alternates:", hunt.altHunters, true)
          .setColor(0xa555bd)
          .setFooter(
            "Created by: " +
              message.author.username +
              " | " +
              moment(date).calendar()
          );
      }
      sent.edit(addHunterEmbed);
    }
  },
  addAltHunter(hunter, message, sent) {
    const addAltHunterEmbed = new MessageEmbed();
    let hunt = Hunts.get(
      message.author.id + " G " + message.guild.name + " M " + sent.id
    );
    if (
      hunt.huntersId.includes(hunter.hunterId) ||
      hunt.altHuntersId.includes(hunter.hunterId)
    ) {
    } else {
      hunt.altHunters.push(hunter.username);
      let newHunterArr = hunt.altHunters.filter((name) => name !== "N/A");
      hunt.altHunters = newHunterArr;
      hunt.altHuntersId.push(hunter.hunterId);
      Hunts.set(
        message.author.id + " G " + message.guild.name + " M " + sent.id,
        hunt
      );

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
      let size = hunt.hunters.includes("N/A") ? "0" : hunt.hunters.length;
      addAltHunterEmbed
        .setTitle("Hunt")
        .addField("Objective:", hunt.desc)
        // .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
        .addField("Time:", times)
        .addField(`Hunters: ${size}/4`, hunt.hunters, true)
        .addField("Alternates:", hunt.altHunters, true)
        .setColor(0xa555bd)
        .setFooter(
          "Created by: " +
            message.author.username +
            " | " +
            moment(date).calendar()
        );
      sent.edit(addAltHunterEmbed);
    }
  },
  deleteHunt(message, sent) {
    let hunt = Hunts.get(
      message.author.id + " G " + message.guild.name + " M " + sent.id
    );
    Hunts.delete(
      message.author.id + " G " + message.guild.name + " M " + sent.id
    );
    let deleteMessage = `**${hunt.desc}** hunt deleted...`;
    message.channel.messages.delete(sent);
    message.channel.send(deleteMessage);
  },
};

module.exports = HuntService;
/**
 let hunter= {
    username: '',
    hunterId: ''
  };
 */

/** API obj
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
  */
