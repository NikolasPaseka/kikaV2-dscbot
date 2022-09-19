const { EmbedBuilder } = require('discord.js')

module.exports = { 
    name: 'queue',
    
    async execute(client, message, args) {
        const queue = client.distube.getQueue(message)
        if (!queue || queue.songs.length === 0) return message.channel.send(`${client.emotes.error} | There is nothing playing!`)

        const q = queue.songs
        .map((song, i) => `${i === 0 ? 'Playing:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
        .join('\n')

        let currentSong = queue.songs[0]
        let embed = new EmbedBuilder()
            .setDescription(q)
            .setFooter({ text: currentSong.formattedDuration})
            .setThumbnail(currentSong.thumbnail)

        message.channel.send({ embeds: [embed] })
    }
}