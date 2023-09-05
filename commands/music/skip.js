const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    config: {
        name: "skip",
        description: "Skip to a song in the queue.",
        accessableby: "Member",
        category: "music",
        options: [{
            name: "amount",
            description: "ilosc piosenek do przeskoczenia",
            type: ApplicationCommandOptionType.Integer,
            required: false
        }]
    },
    run: async (client, interaction, args) => {
        const amount = args.getInteger('amount') ? args.getInteger('amount') : 1
        const msg = await interaction.editReply("Processing.....");

        const queue = client.distube.getQueue(interaction);
        if (!queue) interaction.editReply(`There is nothing in the queue right now!`)

        await client.distube.jump(interaction, amount)
            .then(() => {
                interaction.editReply(`⏭ | Przeskoczono ${amount} utworów`);
            });
    }
}
