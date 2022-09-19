module.exports = { 
    name: 'resume',
    description: 'Resume currently playing song',
    
    async execute(client, message) {
        const queue = client.distube.getQueue(message)

        if (!queue) return message.channel.send('There are no songs in the queue')
        
        queue.resume()
        message.channel.send(`Song has been paused`)
        
    }
}