const { Hunts } = require("../variable");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");

const HuntService = {
  removeHunter(hunter, message, sent, formattedDate) {
    const removeHunterEmbed = new MessageEmbed();
    let hunt = Hunts.get(
      message.author.id + " G " + message.guild.name + " M " + sent.id
    );

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

    let size = hunt.hunters.includes("N/A") ? "0" : hunt.hunters.length;
    let member = message.guild.member(message.author);
    let roleIds = member._roles;
    let roles = member.guild.roles.cache
      .filter((r) => roleIds.includes(r.id))
      .map((i) => i.name);
    let footer = roles.length
      ? "Created by: " + message.author.username + ` [ ${roles.join(" | ")} ] `
      : "Created by: " + message.author.username;

    if (!hunt.altHunters.length) {
      removeHunterEmbed
        .setTitle("Hunt")
        .addField("Objective:", hunt.desc)
        // .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
        .addField("Time:", hunt.time)
        .addField(`Hunters: ${size}/4`, hunt.hunters)
        .setColor(0xa555bd)
        .setFooter(footer)
        .setTimestamp(formattedDate);
    } else {
      removeHunterEmbed
        .setTitle("Hunt")
        .addField("Objective:", hunt.desc)
        // .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
        .addField("Time:", hunt.time)
        .addField(`Hunters: ${size}/4`, hunt.hunters, true)
        .addField("Alternates:", hunt.altHunters, true)
        .setColor(0xa555bd)
        .setFooter(footer)
        .setTimestamp(formattedDate);
    }

    sent.edit(removeHunterEmbed);
  },
  addHunter(hunter, message, sent, formattedDate) {
    const addHunterEmbed = new MessageEmbed();
    let hunt = Hunts.get(
      message.author.id + " G " + message.guild.name + " M " + sent.id
    );
    let size = hunt.hunters.includes("N/A") ? "0" : hunt.hunters.length;

    let member = message.guild.member(message.author);
    let roleIds = member._roles;
    let roles = member.guild.roles.cache
      .filter((r) => roleIds.includes(r.id))
      .map((i) => i.name);
    let footer = roles.length
      ? "Created by: " + message.author.username + ` [ ${roles.join(" | ")} ] `
      : "Created by: " + message.author.username;

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

      if (!hunt.altHunters.length) {
        addHunterEmbed
          .setTitle("Hunt")
          .addField("Objective:", hunt.desc)
          // .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
          .addField("Time:", hunt.time)
          .addField(`Hunters: ${size}/4`, hunt.hunters)
          .setColor(0xa555bd)
          .setFooter(footer)
          .setTimestamp(formattedDate);
      } else {
        addHunterEmbed
          .setTitle("Hunt")
          .addField("Objective:", hunt.desc)
          // .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
          .addField("Time:", hunt.time)
          .addField(`Hunters: ${size}/4`, hunt.hunters, true)
          .addField("Alternates:", hunt.altHunters, true)
          .setColor(0xa555bd)
          .setFooter(footer)
          .setTimestamp(formattedDate);
      }
      sent.edit(addHunterEmbed);
    }
  },
  addAltHunter(hunter, message, sent, formattedDate) {
    const addAltHunterEmbed = new MessageEmbed();
    let hunt = Hunts.get(
      message.author.id + " G " + message.guild.name + " M " + sent.id
    );
    let member = message.guild.member(message.author);
    let roleIds = member._roles;
    let roles = member.guild.roles.cache
      .filter((r) => roleIds.includes(r.id))
      .map((i) => i.name);
    let footer = roles.length
      ? "Created by: " + message.author.username + ` [ ${roles.join(" | ")} ] `
      : "Created by: " + message.author.username;
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

      let size = hunt.hunters.includes("N/A") ? "0" : hunt.hunters.length;
      addAltHunterEmbed
        .setTitle("Hunt")
        .addField("Objective:", hunt.desc)
        // .addField("Time:", hunt.time.slice(0, hunt.time.length - 5), true)
        .addField("Time:", hunt.time)
        .addField(`Hunters: ${size}/4`, hunt.hunters, true)
        .addField("Alternates:", hunt.altHunters, true)
        .setColor(0xa555bd)
        .setFooter(footer)
        .setTimestamp(formattedDate);
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
