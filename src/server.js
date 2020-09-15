const app = require("express")();

const { Hunts } = require("./variable");

module.exports = async (bot) => {
  app.get("/api/hunts", async (req, res) => {
    let Obj = {};

    Hunts.forEach((hunt) => {
      Obj[hunt.id] = {
        server_id: hunt.server_id,
        author_id: hunt.author_id,
        desc: hunt.desc,
        hunters: hunt.huntersId,
        altHunters: hunt.altHuntersId,
        time: hunt.time,
        timeMS: hunt.timeMS,
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
