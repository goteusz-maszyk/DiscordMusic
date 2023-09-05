const { CommandInteraction, CommandInteractionOptionResolver, Message, ApplicationCommandOptionType, PermissionFlagsBits, AutocompleteInteraction, Collection } = require("discord.js");
const Spotify = require('spotify-web');
const { MainClient } = require("../../index")
module.exports = {
    config: {
        name: "play",
        description: "Plays a song from source.",
        accessableby: "Member",
        category: "music",
        options: [{
            name: "nazwa",
            description: "Nazwa lub link utworu",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        }]
    },
    /**
     * @param {MainClient} client
     * @param {CommandInteraction | Message} interaction 
     * @param {CommandInteractionOptionResolver | String[]} args 
     * @returns 
     */
    run: async (client, interaction, args) => {
        const { channel } = interaction.member.voice;
        if (interaction instanceof Message) { if (!channel) return interaction.channel.send(":x: Musisz być na kanale głosowym żeby to zrobić!") }
        else if (!channel) return interaction.editReply(":x: Musisz być na kanale głosowym żeby to zrobić!")

        if (!interaction.guild.members.me.permissions.has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) return interaction.editReply({ embed: { description: "I don't have perm `CONNECT` or `SPEAK` to execute command!", color: "#000001" } });
        if (!interaction.guild.members.me.permissionsIn(channel).has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) return interaction.editReply({ embed: { description: `I don't have perm \`CONNECT\` or \`SPEAK\` in ${channel.name} to join voice!`, color: "#000001" } });

        if (interaction instanceof Message) interaction.channel.send(`**Wyszukuję.....** \`${args.join(" ")}\``).then(msg => setTimeout(() => { try { msg.delete() } catch (e) { } }, 5000))
        else interaction.editReply(`**Wyszukuję.....** \`${args.getString("nazwa")}\` ${args.getString("nazwa").startsWith("https://") ? "Porada: możesz uruchamiać piosenki wpisując tytuł, nie link!" : ""}`)
        let str = ""
        if (interaction instanceof Message) {
            str = args.join(" ")
            if (str == "") return interaction.channel.send("Proszę podać nazwę lub link utworu.")
        } else str = args.getString("nazwa")

        const options = {
            member: interaction.member,
            textChannel: interaction.channel
        }

        if (interaction instanceof Message) {try { interaction.delete() } catch (e) {}}
        
        await client.distube.play(channel, str, options);
        client.addToSongHistory(interaction.member.id, str)

        // const spotifyTrackId = str.includes("open.spotify.com/track/") ? str.split("open.spotify.com/track/")[1].split("?")[0] : null
        // if (spotifyTrackId == null) {await client.distube.play(channel, str, options);return;}
        // Spotify.login(process.env.USERNAME, process.env.PASSWORD, function (err, spotify) {
        //     if (err) console.error(err);

        //     spotify.get(str, function (err, track) {
        //         if (err) console.error(err);
        //         let voice, player;
        //         channel.join().then((connection) => { voice = connection });
                
        //         const audio = track.play()
        //         audio.on('finish', function () {spotify.disconnect();});
                
        //         player = voice.playArbitraryInput(audio)
        //     });
        // });
    },
    /**
     * @param {MainClient} client
     * @param {AutocompleteInteraction} interaction
     */
    autocomplete: (client, interaction) => {
        const focusedValue = interaction.options.getFocused();
        const history = client.getSongHistory(interaction.user.id)
        const final = history.filter((val, key) => key.startsWith(focusedValue)).sort((a, b) => b - a);
        const top5 = new Collection()
        const topKeys = final.firstKey(5)
        const topVals = final.first(5)

        for (const index in topKeys) {
            top5.set(topKeys[index], topVals[index])
        }

        interaction.respond(
            top5.map((val, key) => ({name: key, value: key}))
        )
    }
}
