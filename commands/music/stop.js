const { EmbedBuilder, CommandInteraction } = require("discord.js");

module.exports = {
    config: {
        name: "stop",
        description: "Stop.",
        category: "music",
    },
    /**
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction, args) => {
        const msg = await interaction.editReply("Przetwarzam.....");
        const queue = client.distube.getQueue(interaction);
        const clientVoice = interaction.guild.members.me.voice.channel;
        const memberVoice = interaction.member.voice.channel;

        if (clientVoice === memberVoice) {
            if (queue) {
                client.distube.stop(interaction);
                client.distube.voices.leave(interaction.guild);
            } else {
                client.distube.voices.leave(interaction.guild);
            }

            const embed = new EmbedBuilder()
                .setDescription(`\`🚫\` | **Rozłączono z:** | \`${memberVoice.name}\``)
                .setColor('#025566')

            interaction.editReply({ content: ' ', embeds: [embed] });

        }

    }
}
