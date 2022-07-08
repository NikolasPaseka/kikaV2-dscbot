const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
module.exports = { 
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song'),
    
    async execute(client, message) {
        const queue = client.player.getQueue(message.guildId)

        if (!queue) return message.channel.send('There are no songs in the queue')

        const currentSong = queue.current

        queue.skip()
        message.channel.send({
            embeds: [
                new MessageEmbed().setDescription(`${currentSong.title} has been skipped!`)
                .setThumbnail(currentSong.thumbnail)
            ]
        })
        
    }
}