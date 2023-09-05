const { EmbedBuilder, Client, CommandInteraction, PermissionFlagsBits } = require('discord.js');

module.exports = {
    config: {
        name: "restart",
        description: "shuts down the client!",
        category: "utilities",
        permissions: PermissionFlagsBits.Administrator
    },
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction, args) => {
        if (interaction.user.id != client.owner) return interaction.editReply("Nie jesteś właścicielem!")

        const restart = new EmbedBuilder()
            .setDescription("**Wyłączanie bota...**")
            .setColor("#025566");

        await interaction.channel.send({ embeds: [restart] });
        await interaction.editReply("Shutting down...")
        client.err(`Stopping...`);

        process.exit();
    }
};