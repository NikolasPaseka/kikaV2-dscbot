module.exports = { 
    name: 'resume',
    description: 'Resume currently playing song',
    
    async execute(client, message) {
        const queue = client.distube.getQueue(message)

        if (queue.playing) return message.channel.send('Song uz hraje ZDENO!!')
        
        queue.resume()
        message.channel.send(`Song has been paused xd`)
        
    }
}