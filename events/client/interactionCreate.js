const { Interaction, Client, EmbedBuilder } = require("discord.js");

/**
 * @param {Client} client
 * @param {Interaction} interaction 
 */
module.exports = (client, interaction) => {
  if (!interaction.isCommand() && !interaction.isAutocomplete()) return
  const command = client.commands.get(interaction.commandName)
  if(interaction.isAutocomplete()) {
    command.autocomplete(client, interaction)
    return
  }

  client.warn(`[COMMAND] ${interaction.user.tag} used command \"${interaction.commandName} ${interaction.options.data.map((opt) => { return `${opt.name}:${opt.value}`}).join(" ")}\" in ${interaction.channel.name}@${interaction.guild.name}`);
  if (command == undefined) {
    interaction.reply({
      content: ":x: Nie ma takiej komendy...?",
      ephemeral: true
    })
    client.application.commands.delete(interaction.commandId)
    return
  }
  interaction.deferReply({ ephemeral: true }).then(() => {
    try {
      command.run(client, interaction, interaction.options)
    } catch (error) {
      console.log(error)
      client.err(error);
      const embed = new EmbedBuilder()
        .setColor("#025566")
        .setDescription("There was an error executing that command.");

      return interaction.editReply({ embeds: [embed] });
    }
  })
}