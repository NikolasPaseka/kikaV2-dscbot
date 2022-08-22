module.exports = { 
    name: 'resume',
    description: 'Resume currently playing song',
    
    async execute(client, message) {
        const queue = client.queue.get(message.guild.id)

        if (!queue) return message.channel.send('There are no songs in the queue')
        
        const dispatcher = queue.dispatcher
        dispatcher.resume()
        message.channel.send(`Resuming the song`)
        
    }
}