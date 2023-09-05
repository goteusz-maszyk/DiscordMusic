const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Song, Queue } = require("distube")

/**
 * @param {Queue} queue
 * @param {Song} track
 */
module.exports = async (client, queue, track) => {
  client.musicPlaying[queue.voiceChannel.guildId] = true

  if (client.reloadingSongs[queue.id]) return
  var newQueue = client.distube.getQueue(queue.id)
  var data = disspace(newQueue, track)

  const nowplay = await queue.textChannel.send(data)
  const timeout = setTimeout(() => {try { nowplay.delete()} catch(e) {}}, (track.duration + 1) * 1000)

  const collector = nowplay.createMessageComponentCollector({ time: 12 * 60 * 60 });

  collector.on('collect', async (message) => {
    const id = message.customId;
    const queue = client.distube.getQueue(message.guild.id);
    if (id === "skip") {
      if (!queue) {
        collector.stop();
        return
      }
      if (queue.songs.length === 1) {
        const embed = new EmbedBuilder()
          .setColor("#025566")
          .setDescription("\`🚨\` | **There are no** `Songs` **in queue**")

        message.reply({ embeds: [embed], ephemeral: true });
      } else {
        await client.distube.skip(message)
          .then(song => {
            const embed = new EmbedBuilder()
              .setColor("#025566")
              .setDescription("\`⏭\` | Przeskoczono utwór.")

            nowplay.edit({ components: [] });
            message.reply({ embeds: [embed], ephemeral: true });
          });
        client.warn(`[MUSIC] ${message.user.tag} skipped music in ${message.guild.name}`)
      }
    } else if (id === "stop") {
      if (!queue) {
        collector.stop();
        return
      }
      
      await client.distube.stop(message.guild.id);

      const embed = new EmbedBuilder()
        .setDescription(`\`📛\` | **Utwór został zakończony**`)
        .setColor('#025566')

      message.reply({ embeds: [embed], ephemeral: true });

      client.warn(`[MUSIC] ${message.user.tag} stopped music in ${message.guild.name}`)
      clearTimeout(timeout)
      try { nowplay.delete() } catch(e) {}
    } else if (id === "previous") {
      if (!queue) {
        collector.stop();
        return
      }
      if (queue.previousSongs.length == 0) {
        const embed = new EmbedBuilder()
          .setColor("#025566")
          .setDescription("\`🚨\` | **Nie ma żadnych poprzednich utworów.**")

        message.reply({ embeds: [embed], ephemeral: true });
      } else {
        await client.distube.previous(message)
        const embed = new EmbedBuilder()
          .setColor("#025566")
          .setDescription("\`⏮\` | **Odtwarzam poprzedni utwór**`")

        nowplay.edit({ components: [] });
        message.reply({ embeds: [embed], ephemeral: true });
      }
    }
  });
  collector.on('end', async (collected, reason) => {
    if (reason === "time") nowplay.edit({ components: [] });
  });
}
function disspace(nowQueue, nowTrack) {
  const embeded = new EmbedBuilder()
    .setAuthor({ name: `Odtwarzam muzykę...`, iconURL: 'https://cdn.discordapp.com/emojis/741605543046807626.gif' })
    .setThumbnail(nowTrack.thumbnail)
    .setColor('#025566')
    .setDescription(`**[${nowTrack.name}](${nowTrack.url})**`)
    .addFields(
      { name: `Twórca:`, value: `**[${nowTrack.uploader.name}](${nowTrack.uploader.url})**`, inline: true},
      { name: `Włączona przez:`, value: `${nowTrack.user}`, inline: true},
      { name: `Całkowity czas trwania:`, value: nowQueue.formattedDuration, inline: true}
    )
    .setTimestamp()

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setEmoji("⬅")
        .setStyle(ButtonStyle.Primary)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("stop")
        .setEmoji("✖")
        .setStyle(ButtonStyle.Danger)
    )
    .addComponents(
      new ButtonBuilder()
        .setCustomId("skip")
        .setEmoji("➡")
        .setStyle(ButtonStyle.Primary)
    )
  return {
    embeds: [embeded],
    components: [row]
  }
}