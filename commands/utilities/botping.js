const { Client, CommandInteraction } = require("discord.js");
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  config: {
    name: "botping",
    category: "utilities",
    description: "Są lagi? Sprawdź ping bota!"
  },
  /**
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */
  run: async (client, interaction) => {
    let quality;
    if (client.ws.ping < 150) {
      quality = "(Bardzo dobry)"
    } else if (client.ws.ping < 250) {
      quality = "(ok)"
    } else if (client.ws.ping < 350) {
      quality = "znośny"
    } else {
      quality = "słaby"
    }
    const vc = getVoiceConnection(interaction.guildId, "972412000296661022");
    let vcSuffix = ""
    if (vc != undefined && vc.state.status == "ready") {
      vcSuffix = "\nPing na kanale głosowym: " + vc.ping.ws + "ms"
    }
    interaction.editReply("Mój ping: " + client.ws.ping + "ms " + quality + vcSuffix)
  }
};  
