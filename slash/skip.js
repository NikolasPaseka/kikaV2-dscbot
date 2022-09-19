const { MessageEmbed } = require('discord.js')
module.exports = { 
    name: 'skip',
    description: 'Skips the current song',
    
    async execute(client, message) {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
        if (queue.songs.length === 1) {
            queue.stop()
            return message.channel.send('Skipped! No more songs in the queue')
        }

        try {
            const song = await queue.skip()
            message.channel.send(`Skipped! Now playing:\n${song.name}`)
        } catch (e) {
            message.channel.send(`${e}`)
        }
        
    }
}