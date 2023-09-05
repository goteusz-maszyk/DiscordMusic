const delay = require("delay");
const { Client, ActivityType } = require("discord.js");

/**
 * @param {Client} client 
 */
module.exports = async (client, id) => {
    const barka_url = "https://www.youtube.com/watch?v=1c5IiTVDT6k"
    await delay(2000);
    client.log(`Shard #${id} Ready`)
    client.user.setActivity(`/play <utwór>`, { type: ActivityType.Streaming, url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" });

    setInterval(() => {
        const time = new Date()
        if(time.getHours() != 21 || time.getMinutes() != 37) return
        if(!client.isReady()) return

        client.guilds.cache.forEach((guild, gId) => {
            if(!guild.me.voice.channel) {
                client.distube.play(guild.channels.cache.find(channel => channel.type == "GUILD_VOICE"), barka_url)
            } else {
                client.distube.play(guild.me.voice.channel, barka_url, {skip: true, position: 1})
            }
            
        })
    }, 60 * 1000)
}
