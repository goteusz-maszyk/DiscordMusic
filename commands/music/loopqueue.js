const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "loopqueue",
        description: "loop the song in queue playing.",
        accessableby: "Member",
        category: "music",
    },
    run: async (client, interaction, args) => {
        const msg = await interaction.editReply("Przetwarzam.....");

        const queue = client.distube.getQueue(interaction);
        if (!queue) interaction.editReply(`There is nothing in the queue right now!`)
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply("You need to be in a same/voice channel.")

        if (queue.repeatMode === 2) {
            client.distube.setRepeatMode(interaction, 0);
            const embed = new EmbedBuilder()
                .setColor("#025566")
                .setDescription(`\`🔁\` | **Wyłączono zapętlenie kolejki.**`)

            interaction.editReply({ content: ' ', embeds: [embed] });
        } else {
            client.distube.setRepeatMode(interaction, 2);
            const embed = new EmbedBuilder()
                .setColor("#025566")
                .setDescription(`\`🔁\` | **Włączono zapętlenie kolejki.**`)

            interaction.editReply({ content: ' ', embeds: [embed] });
        }
    }
}
