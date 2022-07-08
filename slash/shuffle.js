const { SlashCommandBuilder } = require('@discordjs/builders')
module.exports = { 
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue'),
    
    async execute(client, message) {
        const queue = client.player.getQueue(message.guildId)

        if (!queue) return message.channel.send('There are no songs in the queue')
        
        queue.shuffle()
        message.channel.send(`The queue of ${queue.tracks.length} songs have been shuffled!`)
        
    }
}