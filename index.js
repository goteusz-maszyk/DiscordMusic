const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { getVoiceConnections } = require("@discordjs/voice");
const fs = require('fs');
const { addSpeechEvent } = require("discord-speech-recognition");
const chalk = require("chalk");

class MainClient extends Client {
  constructor() {
    super({
      shards: "auto",
      allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false
      },
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    process.on('unhandledRejection', error => this.err(error));
    process.on('uncaughtException', error => this.err(error));

    this.config = require('./config');
    this.owner = this.config.OWNER_ID;
    if (!this.token) this.token = this.config.token;

    this.distube = new DisTube(this, {
      searchSongs: 0,
      searchCooldown: 30,
      leaveOnEmpty: this.config.leave_empty,
      emptyCooldown: 60,
      leaveOnFinish: this.config.leave_finish,
      leaveOnStop: this.config.leave_stop,
      plugins: [
        new SpotifyPlugin({
          emitEventsAfterFetching: true
        }),
        new YtDlpPlugin()
      ],
      
    });

    addSpeechEvent(this, { lang: "pl-PL", minimalVoiceMessageDuration: 0.1, profanityFilter: false });
    this.musicPlaying = {};
    this.commands = new Collection();
    this.songHistory = new Collection();
    require(`./handlers/loadEvents`)(this)
    this.file = fs.createWriteStream("./log/" + Number(new Date()) + ".log", { flags: "w+" })
  }
  connect() {
    return super.login(this.token);
  };

  addToSongHistory(userid, entry) {
    if(this.songHistory.get(userid) == undefined) {
      this.songHistory.set(userid, new Collection())
    }
    if(this.songHistory.get(userid).get(entry) == undefined) {
      this.songHistory.get(userid).set(entry, 0)
    }
    const prev = this.songHistory.get(userid).get(entry)
    this.songHistory.get(userid).set(entry, prev + 1)
  }

  setSongHistory(userid, data) {
    this.songHistory.set(userid, data)
  }
  getSongHistory(userid) {
    if(this.songHistory.get(userid) == undefined) {
      this.songHistory.set(userid, new Collection())
    }
    return new Collection(this.songHistory.get(userid))
  }

  log(message) {
    const text = `[${String(new Date).split(" ", 5).join(" ")}] ${message}`
    console.log(chalk.greenBright(text))
    this.file.write(text + "\n")
  }

  warn(message) {
    const text = `[${String(new Date).split(" ", 5).join(" ")}] ${message}`
    console.log(chalk.yellowBright(text))
    this.file.write(text + "\n")
  }

  err(message) {
    const text = `[${String(new Date).split(" ", 5).join(" ")}] ${message}`
    console.error(chalk.redBright(text))
    this.file.write(text + "\n")
  }
};
const client = new MainClient();

client.connect()
process.on('SIGINT', function () { process.exit() });
process.on('exit', () => {
  if (!fs.existsSync("./queuesLeft")) {
    fs.mkdirSync("./queuesLeft");
  }
  client.distube.queues.collection.forEach((queue, guildId) => {
    // {songs: [ { url: str, requestedby: (id) } ], textChannel: (id), voiceChannel: (id), volume: Number(1-100), pausedDuration: Number(current song time[s]) }
    data = JSON.stringify({ songs: queue.songs.map((song) => {
      return { url: song.url, requestedBy: song.user.id }
    }), textChannel: queue.textChannel.id, voiceChannel: queue.voiceChannel.id, volume: queue.volume, pausedDuration: queue.currentTime })
    fs.writeFileSync(`./queuesLeft/${guildId}.json`, data, {encoding: 'utf-8', })
  })
  const payload = {}
  client.songHistory.forEach((data, userid) => payload[userid] = Object.fromEntries(data))
  fs.writeFileSync(`./songHistory.json`, JSON.stringify(payload), { encoding: 'utf-8'})
  getVoiceConnections().forEach((conn) => {
    conn.disconnect()
  })
  client.file.close()
  if (client.user) client.user.setStatus("invisible")
  client.destroy()
});

module.exports = client;