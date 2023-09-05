module.exports = (client, id, replayedEvents) => {
    client.warn(`[${String(new Date).split(" ", 5).join(" ")}] || ==> || Shard #${id} Resumed`)
}
