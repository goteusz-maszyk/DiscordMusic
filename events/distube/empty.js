const { EmbedBuilder } = require("discord.js");

module.exports = async (queue) => {
  const embed = new EmbedBuilder()
    .setColor('#025566')
    .setDescription(`**Kanał jest pusty!**`)

  queue.textChannel.send({ embeds: [embed] })
}