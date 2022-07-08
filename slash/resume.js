const { SlashCommandBuilder } = require('@discordjs/builders')
module.exports = { 
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume currently playing song'),
    
    async execute(client, message) {
        const queue = client.player.getQueue(message.guildId)

        if (!queue) return message.channel.send('There are no songs in the queue')
        
        queue.setPaused(false)
        message.channel.send(`Resuming the song`)
        
    }
}