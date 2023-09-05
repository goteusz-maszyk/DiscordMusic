module.exports = (client, error, id) => {
    client.err(`[${String(new Date).split(" ", 5).join(" ")}] || ==> || Shard #${id} Errored: ` + error)
}
