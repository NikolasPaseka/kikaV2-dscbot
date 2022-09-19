const { MessageEmbed } = require('discord.js')
module.exports = { 
    name: 'stop',
    description: 'Stop song and clear queue',
    
    async execute(client, message) {
        const queue = client.distube.getQueue(message)
        if (queue.songs.length > 0) {
            queue.stop()
            return message.channel.send('Stoped! Queue cleared!')
        }
    }
}