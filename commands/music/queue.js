const { EmbedBuilder, CommandInteraction, CommandInteractionOptionResolver, ApplicationCommandOptionType } = require("discord.js");
const pagequeue = require('../../structures/pagequeue.js');
const {MainClient} = require("../../index")

module.exports = {
	config: {
		name: "queue",
		description: "Diplay the queue",
		category: "music",
		options: [{
			name: "strona",
			description: "Nazwa lub link utworu",
			type: ApplicationCommandOptionType.Integer,
			required: false
		}]
	},
  /**
	 * @param {MainClient} client
	 * @param {CommandInteraction} interaction 
	 * @param {CommandInteractionOptionResolver} args 
	 * @returns 
	 */
	run: async (client, interaction, args) => {
		const queue = client.distube.getQueue(interaction.guild);
		if (!queue) return interaction.editReply(`Kolejka jest pusta`)
		const { channel } = interaction.member.voice;
		if (!channel || interaction.member.voice.channel !== interaction.guild.members.me.voice.channel) return interaction.channel.send("You need to be in a same/voice channel.")

		const pagesNum = Math.ceil(queue.songs.length / 10);
		if (pagesNum === 0) pagesNum = 1;

		const qduration = queue.formattedDuration;

		const songStrings = [];
		for (let i = 1; i < queue.songs.length; i++) {
			const song = queue.songs[i];
			songStrings.push(
				`**${i}.** [${song.name}](${song.url}) \`[${song.formattedDuration}]\` • ${song.user}
				`);
		}

		const pages = [];
		for (let i = 0; i < pagesNum; i++) {
			const str = songStrings.slice(i * 10, i * 10 + 10).join('');
			const embed = new EmbedBuilder()
				.setAuthor({ name: `Kolejka`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
				.setThumbnail(queue.songs[0].thumbnail)
				.setColor(client.config.color)
				.setDescription(`**Aktualnie odtwarzam:**\n**[${queue.songs[0].name}](${queue.songs[0].url})** \`[${queue.songs[0].formattedDuration}]\` • ${queue.songs[0].user}\n\n**Rest of queue**${str == '' ? '  Nothing' : '\n' + str}`)
				.setFooter({ text: `Strona • ${i + 1}/${pagesNum} | ${queue.songs.length} ${pluralUtwory(queue.songs.length)} | ${queue.formattedDuration} • Całkowity czas` });
			pages.push(embed);
		}

		if (!args[0]) {
			if (pages.length == pagesNum && queue.songs.length > 10) pagequeue(client, interaction, pages, 60000, queue.songs.length, qduration);
			else return interaction.editReply({ embeds: [pages[0]] });
		}
		else {
			if (isNaN(args[0])) return interaction.editReply('Page must be a number.');
			if (args[0] > pagesNum) return interaction.editReply(`There are only ${pagesNum} pages available.`);
			const pageNum = args[0] == 0 ? 1 : args[0] - 1;
			return interaction.editReply({ embeds: [pages[pageNum]] });
		}
	}
}

function pluralUtwory(amount) {
	if(amount == 1) {
		return "utwór"
	} else if(amount%10 > 1 && amount%10 < 5) {
		return "utwory"
	} else {
		return "utworów"
	}
}