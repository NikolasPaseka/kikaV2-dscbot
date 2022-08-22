const { MessageEmbed } = require('discord.js')
module.exports = { 
    name: 'skip',
    description: 'Skips the current song',
    
    async execute(client, message) {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)

        try {
            const song = await queue.skip()
            message.channel.send(`Skipped! Now playing:\n${song.name}`)
        } catch (e) {
            message.channel.send(`${e}`)
        }
        
    }
}