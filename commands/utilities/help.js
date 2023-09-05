const { EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");
const { stripIndents } = require("common-tags");

module.exports = {
    config: {
        name: "help",
        category: "utilities",
        description: "Displays all commands that the bot has.",
    },
    run: async (client, message, args) => {
        const embed = new EmbedBuilder()
            .setColor('#025566')
            .setAuthor({ name: `Help!`, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }));

        if (!args[0]) {
            const categories = readdirSync("./commands/")

            embed.setFooter({ text: `© gotitim#5931 | Total Commands: ${client.commands.size}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            categories.forEach(category => {
                const dir = client.commands.filter(c => c.config.category === category)
                const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1)
                try {
                    embed.addFields({name: `❯ ${capitalise} [${dir.size}]:`, value: dir.map(c => `\`${c.config.name}\``).join(" ")})
                } catch (e) {
                    client.err(e)
                }
            })

            return message.channel.send({ embeds: [embed] })
        } else {
            let command = client.commands.get(args[0].toLowerCase())
            if (!command) return message.channel.send({ embeds: [embed.setTitle("Invalid Command.").setDescription(`Do \`/help\` for the list of the commands.`)] })
            command = command.config

            embed.setDescription(stripIndents(
            `**Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}
            **Description:** ${command.description || "Brak opisu."}`))

            return message.channel.send({ embeds: [embed] })
        }
    }
}