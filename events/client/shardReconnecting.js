module.exports = (client, id) => {
    client.warn(`[${String(new Date).split(" ", 5).join(" ")}] || ==> || Shard #${id} Reconnecting`)
}
