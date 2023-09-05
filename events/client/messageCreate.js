module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === "dm") return;

  if (message.channel.id != "975816157598724167") return
  var urlRegex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

  if (urlRegex.test(message.content)) {
    client.commands.get("play").run(client, message, [message.content])
    return
  }
}