const { EmbedBuilder } = require("discord.js");
const { Queue, Song } = require("distube");
/**
 * 
 * @param {*} client 
 * @param {Queue} queue 
 * @param {Song} song 
 */
module.exports = async (client, queue, song) => {
    if (client.reloadingSongs[queue.id]) return
    if (queue.songs.length != 1) {
        let embed = new EmbedBuilder()
            .setDescription(`**Zakolejkowano • [${song.name}](${song.url})** \`${song.formattedDuration}\` • ${song.user}`)
            .setColor('#025566')
            .setTimestamp()

        queue.textChannel.send({ content: ' ', embeds: [embed] }).then(msg => {
            song.msg = msg
        })
    }
}