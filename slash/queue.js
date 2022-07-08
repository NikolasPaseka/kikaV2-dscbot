const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = { 
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the current song queue')
        .addNumberOption((option) => option.setName('page').setDescription('Page number of the queue').setMinValue(1)),
    
    async execute(client, message, args) {
        const queue = client.player.getQueue(message.guildId)
        if (!queue || !queue.playing) {
            return await message.channel.send('No songs in the queue')
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (args[0] || 1) - 1

        if (page > totalPages)
            return message.channel.send(`Invalid page. There are only ${totalPages} pages`)

        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `${page * 10 + i + 1}. \`[${song.duration}]\` ${song.title}`
        }).join('\n')

        const currentSong = queue.current

        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Currently Playing**\n` +
                        (currentSong ? `**[${currentSong.duration}] ${currentSong.title}**` : 'None') +
                        `\n\n**Queue**\n${queueString}`)
                    .setFooter({
                        text: `Page ${page + 1} of ${totalPages}`
                    })
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}