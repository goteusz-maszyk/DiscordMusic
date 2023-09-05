const figlet = require('figlet');
const chalk = require('chalk');
const { MainClient } = require("../../index");
const fs = require('fs');
const { Collection } = require('discord.js');
/**
 * @param {MainClient} client 
 */
module.exports = async (client) => {
  figlet(client.user.tag, function (err, data) {
    if (err) {
      client.err('Something went wrong with figlet...');
      console.dir(err);
      return;
    }
    console.log(chalk.red.bold(data));
  });
  ["loadCommands", "loadDistube"].forEach(x => require(`../../handlers/${x}`)(client));
  client.reloadingSongs = {}
  setTimeout(() => {
    fs.readdirSync("queuesLeft").forEach(async (file) => {
      const guild = client.guilds.cache.get(file.split(".")[0]);
      client.reloadingSongs[guild.id] = true
      const queueData = JSON.parse(fs.readFileSync("queuesLeft/" + file, {encoding: "utf-8"}))
      const vc = guild.channels.cache.get(queueData.voiceChannel)
      const tc = guild.channels.cache.get(queueData.textChannel)
      let isFirst = true
      for (i in queueData.songs) {
        const song = queueData.songs[i]
        const opts = { textChannel: tc, member: guild.members.cache.get(song.requestedBy) }
        await client.distube.play(vc, song.url, opts)

        if(isFirst) {
          client.distube.seek(guild, queueData.pausedDuration)
          isFirst = false
          client.distube.setVolume(guild, queueData.volume)
        }
      }

      fs.unlinkSync("queuesLeft/" + file)
      client.reloadingSongs[guild.id] = false
    })

    const history = JSON.parse(fs.readFileSync('songHistory.json', { encoding: "utf-8" }))
    Object.keys(history).forEach(userid => {
      client.setSongHistory(userid, new Collection(Object.entries(history[userid])))
    })
  }, 3000)
}
