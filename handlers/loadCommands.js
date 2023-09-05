const { readdirSync } = require("fs")
const delay = require('delay');
const { Client, ApplicationCommandType } = require("discord.js");

/**
 * @param {Client} client 
 */
module.exports = async (client) => {
  const load = dirs => {
    const commands = readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'));
    for (let file of commands) {
      let pull = require(`../commands/${dirs}/${file}`);
      client.commands.set(pull.config.name, pull);
    };
  };
  ["music", "utilities"].forEach(x => load(x));
  for (let command of client.commands) {
    client.application.commands.create({
      name: command[0],
      description: command[1].config.description,
      options: command[1].config.options,
      type: ApplicationCommandType.ChatInput,
      default_member_permissions: command[1].config.permissions,
      dm_permission: false,
    })
  }
  await delay(4000)
  client.log(`Commands Loaded`);
};