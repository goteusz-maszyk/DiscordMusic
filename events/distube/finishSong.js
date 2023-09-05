const { Queue, Song } = require("distube");

/**
 * @param {Queue} queue 
 * @param {Song} song
 */
module.exports = async (client, queue, song) => {
  client.musicPlaying[queue.voiceChannel.guildId] = false
  try { song.msg.delete() } catch(e) {}
}