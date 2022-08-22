module.exports = { 
    name: 'pause',
    description: 'pause currently playing song',
    async execute(client, message) {
        const queue = client.player.getQueue(message.guildId)

        if (!queue) return message.channel.send('There are no songs in the queue')
        
        queue.setPaused(true)
        message.channel.send(`Song has been paused`)
        
    }
}