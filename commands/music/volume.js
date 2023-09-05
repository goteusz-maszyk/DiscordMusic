const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    config: {
        name: "volume",
        description: "Zmienia głośność aktualnie odtwarzanej muzyki.",
        accessableby: "Member",
        category: "music",
        options: [{
            name: "glosnosc",
            description: "Nowa głośność odtwarzania",
            type: ApplicationCommandOptionType.Integer,
            required: true
        }]
    },
    run: async (client, interaction, args) => {
        await interaction.editReply("Przetwarzam.....");

        const volume = args.getInteger('glosnosc');

        if (!volume) {
            const embed = new EmbedBuilder()
                .setColor("#025566")
                .setDescription(`**Aktualna głośność** : \`${queue.volume}\`%`)

            return interaction.editReply({ content: ' ', embeds: [embed] });
        }

        if (Number(volume) < 1 || Number(volume) > 100) return interaction.editReply(`Podaj numer między 1 a 100`)

        client.distube.setVolume(interaction, volume);

        const embed = new EmbedBuilder()
            .setColor("#025566")
            .setDescription(`\`🔊\` | **Zmieniono głośność:** \`${volume}\`%`)

        interaction.editReply({ content: ' ', embeds: [embed] });
    }
}
