const { CommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "autoplay",
        description: "Toggles autoplay for the current guild.",
        accessableby: "Member",
        category: "music",
    },
    /**
     * @param {CommandInteraction} interaction 
     * @returns 
     */
    run: async (client, interaction, args) => {
        interaction.editReply("Processing.....");

        const queue = client.distube.getQueue(message);
        if (!queue) { interaction.editReply(`There is nothing in the queue right now!`); return }

        client.distube.toggleAutoplay(message);
        const embed = new EmbedBuilder()
            .setColor("#025566")

        if (!queue.autoplay) {
            embed.setDescription(`\`⏯\` Activated **Autoplay**.`)
        } else {
            embed.setDescription(`\`⏯\` Disabled **Autoplay**.`)
        }
        interaction.editReply({ content: ' ', embeds: [embed] });
    }
}
