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
    let newAltIdArr = hunt.altHuntersId.filter((id) => id !== hunter.id);
    hunt.hunters = newHunterArr;
    hunt.altHunters = newAltArr;
    hunt.huntersId = newHunterId;
    hunt.altHuntersId = newAltIdArr;
    Hunts.set(
      message.author.id + " G " + message.guild.name + " M " + sent.id,
      hunt
    );
    if (!hunt.hunters.length) hunt.hunters.push("N/A");
    let date = new Date(hunt.time);
    let size = hunt.hunters.includes("N/A") ? "0" : hunt.hunters.length;
    if (!hunt.altHunters.length) {
      removeHunterEmbed
        .setTitle("Hunt")
        .addField("Objective:", hunt.desc, true)
        .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
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
        .addField("Objective:", hunt.desc, true)
        .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
        .addField(`Hunters: ${size}/4`, hunt.hunters)
        .addField("Alternates:", hunt.altHunters)
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

    if (
      hunt.huntersId.includes(hunter.hunterId) ||
      hunt.altHuntersId.includes(hunter.hunterId)
    ) {
    } else {
      console.log("adding hunter...");
      hunt.hunters.push(hunter.username);
      let newHunterArr = hunt.hunters.filter((name) => name !== "N/A");
      hunt.hunters = newHunterArr;
      hunt.huntersId.push(hunter.hunterId);
      Hunts.set(
        message.author.id + " G " + message.guild.name + " M " + sent.id,
        hunt
      );

      let date = new Date(hunt.time);
      let size = hunt.hunters.includes("N/A") ? "0" : hunt.hunters.length;
      if (!hunt.altHunters.length) {
        addHunterEmbed
          .setTitle("Hunt")
          .addField("Objective:", hunt.desc, true)
          .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
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
          .addField("Objective:", hunt.desc, true)
          .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
          .addField(`Hunters: ${size}/4`, hunt.hunters)
          .addField("Alternates:", hunt.altHunters)
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
      let size = hunt.hunters.includes("N/A") ? "0" : hunt.hunters.length;
      addAltHunterEmbed
        .setTitle("Hunt")
        .addField("Objective:", hunt.desc, true)
        .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
        .addField(`Hunters: ${size}/4`, hunt.hunters)
        .addField("Alternates:", hunt.altHunters)
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
