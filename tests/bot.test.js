const Discord = require("discord.js");
const { locale } = require("moment");

// replace this with whatever the execute command is
// e.g. const ping = require('./commands/ping').execute
// const ping = async (message, args) => {
//   message.channel.send("Pong");
// };
const monster = require("../src/commands/monster").execute;
const localeCommand = require("../src/commands/locale").execute;
const hunt = require("../src/commands/hunt").execute;

// a counter so that all the ids are unique
let count = 0;

class Guild extends Discord.Guild {
  constructor(client) {
    super(client, {
      // you don't need all of these but I just put them in to show you all the properties that Discord.js uses
      id: count++,
      name: "",
      icon: null,
      splash: null,
      owner_id: "",
      region: "",
      afk_channel_id: null,
      afk_timeout: 0,
      verification_level: 0,
      default_message_notifications: 0,
      explicit_content_filter: 0,
      roles: [],
      emojis: [],
      features: [],
      mfa_level: 0,
      application_id: null,
      system_channel_id: null,
    });
    this.client.guilds.cache.set(this.id, this);
  }
}

class TextChannel extends Discord.TextChannel {
  constructor(guild) {
    super(guild, {
      id: count++,
      type: 0,
    });
    this.client.channels.cache.set(this.id, this);
  }

  // you can modify this for other things like attachments and embeds if you need
  send(content) {
    return this.client.actions.MessageCreate.handle({
      id: count++,
      type: 0,
      channel_id: this.id,
      content,
      author: {
        id: "bot id",
        username: "bot username",
        discriminator: "1234",
        bot: true,
      },
      pinned: false,
      tts: false,
      nonce: "",
      embeds: [],
      attachments: [],
      timestamp: Date.now(),
      edited_timestamp: null,
      mentions: [],
      mention_roles: [],
      mention_everyone: false,
    });
  }
}

class Message extends Discord.Message {
  constructor(content, channel, author) {
    super(
      channel.client,
      {
        id: count++,
        type: 0,
        channel_id: channel.id,
        content,
        author,
        pinned: false,
        tts: false,
        nonce: "",
        embeds: [],
        attachments: [],
        timestamp: Date.now(),
        edited_timestamp: null,
        mentions: [],
        mention_roles: [],
        mention_everyone: false,
      },
      channel
    );
  }
}

const client = new Discord.Client();
const guild = new Guild(client);
const channel = new TextChannel(guild);

// the user that executes the commands
const user = { id: count++, username: "username", discriminator: "1234" };

describe("monster", () => {
  it("sends embed of monster", async () => {
    await monster(
      new Message("monster", channel, user),
      "rathalos",
      new Discord.MessageEmbed(),
      ["monster", "rathalos"]
    );
    expect(channel.lastMessage.content).toHaveProperty("title");
    expect(channel.lastMessage.content).toHaveProperty("thumbnail");
    expect(channel.lastMessage.content).toHaveProperty("fields");
    expect(channel.lastMessage.content.fields).toHaveLength(4);
    expect(channel.lastMessage.content).toHaveProperty("description");
  });
  it("sends error message when typo of monsters name", async () => {
    await monster(
      new Message("monster", channel, user),
      "wrong name",
      new Discord.MessageEmbed(),
      ["monster", "wrong", "name"]
    );
    expect(channel.lastMessage.content.content).toBe(
      `Sorry, I can't find that monster in my research notes!`
    );
  });
});
describe("locale", () => {
  it("sends an embed of monsters in locale", async () => {
    await localeCommand(
      new Message("locale", channel, user),
      "forest",
      new Discord.MessageEmbed(),
      ["locale", "forest"]
    );
    expect(channel.lastMessage.content).toHaveProperty("title");
    expect(channel.lastMessage.content.title).toContain("**Ancient Forest**");
    expect(channel.lastMessage.content.fields).toHaveLength(8);
  });
  it("responds with error message when locale typo exists", async () => {
    await localeCommand(
      new Message("locale", channel, user),
      "foerst",
      new Discord.MessageEmbed(),
      ["locale", "foerst"]
    );
    expect(channel.lastMessage.content.content).toBe(
      `Sorry I can\'t find any monsters in **foerst**`
    );
  });
});
// describe.only("hunt", () => {
//   it("sends an embed of details of the hunt", async () => {
//     await hunt(new Message("hunt", channel, user), new Discord.MessageEmbed(), [
//       "hunt",
//       "objective",
//     ]);
//     console.log(channel.lastMessage);
//   });
// });
