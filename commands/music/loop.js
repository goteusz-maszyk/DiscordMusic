const { CommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    config: {
        name: "loop",
        description: "loop the song currently playing.",
        accessableby: "Member",
        category: "music",
    },
    /**
     * @param {CommandInteraction} interaction 
     * @returns 
     */
    run: async (client, interaction, args) => {
        interaction.editReply("Processing.....");
        
        const queue = client.distube.getQueue(interaction);
        if (!queue) interaction.editReply(`There is nothing in the queue right now!`)

        if (queue.repeatMode === 0) {
            client.distube.setRepeatMode(interaction, 1);
            const embed = new EmbedBuilder()
                .setColor("#025566")
                .setDescription(`\`🔁\` | **Current song is looped**`)

            interaction.editReply({ content: ' ', embeds: [embed] });
        } else {
            client.distube.setRepeatMode(interaction, 0);
            const embed = new EmbedBuilder()
                .setColor("#025566")
                .setDescription(`\`🔁\` | **Current song is unlooped**`)

            interaction.editReply({ content: ' ', embeds: [embed] });
        }
    }
}
