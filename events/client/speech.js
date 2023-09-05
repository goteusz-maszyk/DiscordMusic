const { VoiceMessage } = require("discord-speech-recognition")
const client = require("../..")

const banWords = [
  "posran",
  "debil",
  "pierdol",
  "kurw"
]
/**
 * @param {VoiceMessage} voiceMessage 
 */
module.exports = (voiceMessage) => {
  client.log("[STT] " + voiceMessage.content)
  if (!voiceMessage.content) return
  for (word in banWords) {
    if (!voiceMessage.content.includes(word)) continue
    voiceMessage.member.timeout(5 * 1000, "Tak niemiło")
    if (!client.musicPlaying[queue.voiceChannel.guildId]) {
      // play sound
    }
  }
}
