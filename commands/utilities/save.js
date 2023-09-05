const { Client, CommandInteraction, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
  config: {
    name: "save",
    description: "Zapisuje dane bota",
    category: "utilities",
    permissions: PermissionFlagsBits.Administrator
  },
  /**
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */
  run: async (client, interaction, args) => {
    if (interaction.user.id != client.owner) return interaction.editReply("Nie jesteś właścicielem!")

    interaction.editReply("Zapisywanie danych...");
    client.log(`Saving data...`);
    const start = new Date()
    const payload = {};
    client.songHistory.forEach((data, userid) => payload[userid] = Object.fromEntries(data));
    fs.writeFileSync(`./songHistory.json`, JSON.stringify(payload), { encoding: 'utf-8' });
    const end = new Date()
    interaction.editReply(`Zapisano (${end-start} ms)`);
    client.log(`Saved data (${end - start} ms)`)
  }
};