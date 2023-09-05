module.exports = (client, event, id) => {
    client.err(`[${String(new Date).split(" ", 5).join(" ")}] || ==> || Shard #${id} Disconnected`)
}
