module.exports = { 
    name: 'unloop',
    description: 'unloop the current queue',
    async execute(client, message) {
        const queue = client.distube.getQueue(message)

        if (!queue || queue.songs.length === 0) return message.channel.send(`There is nothing playing!`)
        
        queue.setRepeatMode(0)
        message.channel.send(`Queue has been unlooped`)
    }
}