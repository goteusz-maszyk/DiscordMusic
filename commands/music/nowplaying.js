const { EmbedBuilder, CommandInteraction } = require("discord.js");

module.exports = {
    config: {
        name: "nowplaying",
        description: "Displays the current song playing.",
        accessableby: "Member",
        category: "music",
    },
    /**
     * @param {CommandInteraction} interaction
     * @returns 
     */
    run: async (client, interaction, args) => {
        interaction.editReply('Processing.....');

        const queue = client.distube.getQueue(interaction);
        if (!queue) { interaction.editReply(`There is nothing in the queue right now!`); return }

        const uni = `${queue.songs[0].playing ? '⏸️ |' : '🔴 |'}`;
        const part = Math.floor((queue.currentTime / queue.songs[0].duration) * 30);

        const embed = new EmbedBuilder()
            .setAuthor({ name: queue.songs[0].playing ? 'Song Pause...' : 'Now Playing...', iconURL: "https://cdn.discordapp.com/emojis/741605543046807626.gif" })
            .setColor('#025566')
            .setDescription(`**[${queue.songs[0].name}](${queue.songs[0].url})**`)
            .setThumbnail(`${queue.songs[0].thumbnail}`)
            .addFields(
                { name: "Twórca:", value: `[${queue.songs[0].uploader.name}](${queue.songs[0].uploader.url})`, inline: true },
                { name: "Dodane do kolejki przez:", value: `${queue.songs[0].user}`, inline: true},
                { name: "Głośność: ", value: `${queue.volume}`, inline: true },
                { name: `Czas: \`[${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}]\``, value: `\`\`\`${uni} ${'─'.repeat(part) + '🎶' + '─'.repeat(30 - part)}\`\`\`` }
            )
            .setTimestamp()

        interaction.editReply({ content: ' ', embeds: [embed] });
    }
}
