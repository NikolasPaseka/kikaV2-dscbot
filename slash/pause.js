module.exports = { 
    name: 'pause',
    description: 'pause currently playing song',
    async execute(client, message) {
        const queue = client.distube.getQueue(message)

        if (!queue.playing) return message.channel.send('No song is playing ty tupaku')
        
        queue.pause()
        message.channel.send(`Song has been paused`)
        
    }
}