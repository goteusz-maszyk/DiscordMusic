const { EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "replay",
        description: "Replays the current song.",
        accessableby: "Member",
        category: "music",
    },
    run: async (client, interaction, args) => {
        const msg = await interaction.editReply("Processing.....");

        const queue = client.distube.getQueue(interaction);
        if (!queue) interaction.editReply(`There is nothing in the queue right now!`)
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply("You need to be in a same/voice channel.")

        await queue.seek(0)

        const embed = new EmbedBuilder()
            .setColor("#025566")
            .setDescription("\`🔁\` | Odtwarzam ponownie utwór")

        interaction.editReply({ content: ' ', embeds: [embed] });

    }
}
