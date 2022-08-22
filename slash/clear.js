const { description } = require("./play")

module.exports = { 
    name: 'clear',
    description: 'removes queue',
    async execute(client, message) {
        const queue = client.player.getQueue(message.guildId)
        
        if (!queue) return message.channel.send('There are no songs in the queue')
        
        queue.delete()
        message.channel.send(`Queue has been deleted`)
        
    }
}