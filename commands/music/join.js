const { PermissionFlagsBits, CommandInteraction, EmbedBuilder } = require("discord.js");
const { MainClient } = require("../../index")
const { joinVoiceChannel, entersState } = require("@discordjs/voice")
module.exports = {
	config: {
		name: "join",
		description: "Makes the bot join the voice channel.",
		accessableby: "Member",
		category: "music",
	},
	/**
	 * @param {MainClient} client
	 * @param {CommandInteraction} interaction 
	 * @returns 
	 */
	run: async (client, interaction, args) => {
		await interaction.editReply("Przetwarzam.....");
		

		const { channel } = interaction.member.voice;

		if (!channel) {
			const embed = new EmbedBuilder()
				.setColor("#025566")
				.setDescription(`You must be in a voice channel!`);

			return interaction.editReply({ embeds: [embed] });
		}

		if (!interaction.guild.members.me.permissions.has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) return interaction.editReply({ embed: { description: "I don't have perm `CONNECT` or `SPEAK` to execute command!", color: "#000001" } });
		if (!interaction.guild.members.me.permissionsIn(channel).has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) return interaction.editReply({ embed: { description: `I don't have perm \`CONNECT\` or \`SPEAK\` in ${channel.name} to join voice!`, color: "#000001" } });
		const memberVoice = interaction.member.voice.channel;

		// joinVoiceChannel({
		// 	channelId: memberVoice.id,
		// 	guildId: memberVoice.guild.id,
		// 	adapterCreator: memberVoice.guild.voiceAdapterCreator,
		// 	selfDeaf: false,
		// });
		client.distube.voices.join(memberVoice)
			.then(voice => {
				const embed = new EmbedBuilder()
					.setColor('#025566')
					.setDescription(`\`🔊\` | **Dołączono do:** \`${memberVoice.name}\``)

				interaction.editReply({ embeds: [embed] });
			}).catch(e => {
				client.err(e);
			})
	}
}
