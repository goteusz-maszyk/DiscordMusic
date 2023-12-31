const { MessageActionRow, MessageButton } = require('discord.js')

module.exports = async (client, message, pages, timeout, queueLength, queueDuration) => {
    if (!message && !message.channel) throw new Error('Channel is inaccessible.');
    if (!pages) throw new Error('Pages are not given.');

    const row1 = new MessageButton()
        .setCustomId('back')
        .setLabel('⬅')
        .setStyle('SECONDARY')
    const row2 = new MessageButton()
        .setCustomId('next')
        .setLabel('➡')
        .setStyle('SECONDARY')
    const row = new MessageActionRow()
        .addComponents(row1, row2)

    let page = 0;
    const curPage = await message.channel.send({ embeds: [pages[page].setFooter({ text: `Strona • ${page + 1}/${pages.length} | ${queueLength} • Utwory | ${queueDuration} • Całkowity czas trwania` })], components: [row], allowedMentions: { repliedUser: false } });
    if (pages.length == 0) return;

    const filter = (interaction) => interaction.user.id === message.author.id ? true : false && interaction.deferUpdate();
    const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });

    collector.on('collect', async (interaction) => {
        if (!interaction.deferred) await interaction.deferUpdate();
        if (interaction.customId === 'back') {
            page = page > 0 ? --page : pages.length - 1;
        } else if (interaction.customId === 'next') {
            page = page + 1 < pages.length ? ++page : 0;
        }
        curPage.edit({ embeds: [pages[page].setFooter({ text: `Strona • ${page + 1}/${pages.length} | ${queueLength} • Utwory | ${queueDuration} • Całkowity czas trwania` })], components: [row] })
    });
    collector.on('end', () => {
        const disabled = new MessageActionRow()
            .addComponents(row1.setDisabled(true), row2.setDisabled(true))
        curPage.edit({ embeds: [pages[page].setFooter({ text: `Strona • ${page + 1}/${pages.length} | ${queueLength} • Utwory | ${queueDuration} • Całkowity czas trwania` })], components: [disabled] })
    });
    return curPage;
};