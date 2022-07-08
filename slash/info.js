const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')


module.exports = { 
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Displays info about the currently played song'),
    
    async execute(client, message) {
        const queue = client.player.getQueue(message.guildId)

        if (!queue) return message.channel.send('There are no songs in the queue')
        
        let bar = queue.createProgressBar({
            queue: false,
            length: 19
        })

        const song = queue.current

        message.channel.send({
            embeds: [new MessageEmbed()
                .setThumbnail(song.thumbnail)
                .setDescription(`Currently playing [${song.title}(${song.url})\n\n]` + bar)
            ]
        })
        
    }
}