const app = require("express")();

const { Hunts } = require("./variable");
const { Message } = require("discord.js");

module.exports = async (bot) => {
  app.get("/api/hunts", async (req, res) => {
    let Obj = {};
    // let id = Math.floor(1000 + Math.random() * 9000);
    // while (Obj[id]) {
    //   console.log("new id for: ", id);
    //   id = Math.floor(1000 + Math.random() * 9000);
    // }
    Hunts.forEach((hunt) => {
      Obj[hunt.id] = {
        server_id: hunt.server_id,
        author_id: hunt.author_id,
        desc: hunt.content,
        hunters: hunt.huntersId,
        altHunters: hunt.altHuntersId,
        time: hunt.time,
      };
    });
    res.send(Obj);
  });
  app.listen(8080);
};

/**
 * id: [random 4-digit integer],
 * server_id: message.guild.id,
 * author_id: message.author.id,
 * desc: message.content
 * hunters: [Arr of hunters],
 * altHunters: [Arr of alt hunters]
 * time: in ms
 */
