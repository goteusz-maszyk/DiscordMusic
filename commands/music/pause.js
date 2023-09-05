const { EmbedBuilder, CommandInteraction } = require("discord.js");

module.exports = {
    config: {
        name: "pause",
        description: "Pauzuje.",
        category: "music",
    },
    /**
     * @param {CommandInteraction} interaction
     * @returns 
     */
    run: async (client, interaction, args) => {

        const queue = client.distube.getQueue(interaction);
        if (!queue) interaction.editReply(`Kolejka jest pusta!`)
        const { channel } = interaction.member.voice;
        if (!channel || interaction.member.voice.channel !== interaction.guild.me.voice.channel) return interaction.editReply("You need to be in a same/voice channel.")

        if (queue.paused) {
            client.distube.resume(interaction)
            const embed = new EmbedBuilder()
                .setColor("#025566")
                .setDescription(`\`⏯\` | **Wznowiono utwór**`);

            interaction.editReply({ content: ' ', embeds: [embed] });
        } else {
            client.distube.pause(interaction);
            const embed = new EmbedBuilder()
                .setColor("#025566")
                .setDescription(`\`⏯\` | **Zapauzowano utwór**`);

            interaction.editReply({ content: ' ', embeds: [embed] });
        }
    }
}
