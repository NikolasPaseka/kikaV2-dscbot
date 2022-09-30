module.exports = { 
    name: 'loop',
    description: 'loop the current queue',
    async execute(client, message) {
        const queue = client.distube.getQueue(message)

        if (!queue || queue.songs.length === 0) return message.channel.send(`There is nothing playing!`)
        
        queue.setRepeatMode(2)
        message.channel.send(`Queue has been looped`)
    }
}