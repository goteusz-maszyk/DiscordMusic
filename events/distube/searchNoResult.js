const { EmbedBuilder } = require("discord.js");

module.exports = async (client, query, queue) => {
    const embed = new EmbedBuilder()
        .setColor("#025566")
        .setDescription(`Nie znaleziono wyników dla: ${query}!`)

    queue.textChannel.send({ embeds: [embed] })
}