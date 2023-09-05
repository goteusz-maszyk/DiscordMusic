const { EmbedBuilder } = require("discord.js");

module.exports = async (client, queue, playlist) => {
  const embed = new EmbedBuilder()
    .setDescription(`**Zakolejkowano • [${playlist.name}](${playlist.url})** \`${queue.formattedDuration}\` (${playlist.songs.length} utworów) • ${playlist.user}`)
    .setColor('#025566')

  queue.textChannel.send({ embeds: [embed] })
}