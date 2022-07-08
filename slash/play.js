const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { QueryType } = require('discord-player')

const fetch = require('isomorphic-unfetch')
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch)

async function playResponse(queue, message, embed) {
    if (!queue.playing) await queue.play()
    message.channel.send({
        embeds: [embed]
    })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play songs from youtube or spotify'),
    async execute(client, message, args) {
        if (!message.member.voice.channel) {
            return message.channel.send('You need to be in voice channel in order to play song')
        }

        const queue = await client.player.createQueue(message.guildId)
        if (!queue.connection) await queue.connect(message.member.voice.channel)

        let embed = new MessageEmbed()

        if (args[0].startsWith('https://www.youtube.com/watch')) {
            let url = args[0]
            const result = await client.player.search(url, {
                requestedBy: message.author.username,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0) return message.channel.send('No results')
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})

        } else if (args[0].startsWith('https://www.youtube.com/playlist')) {
            let url = args[0]
            const result = await client.player.search(url, {
                requestedBy: message.author.username,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })
            if (result.tracks.length === 0) return message.channel.send('No results')
            
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** has been added to the Queue`)
                .setThumbnail(playlist.thumbnail)

        } else if (args[0].startsWith('https://open.spotify.com/track/')) {
            let url = args[0]
            await getPreview(url)
            .then(async (data) => {

                let searchTerms = data.title + data.artist
                const result = await client.player.search(searchTerms, {
                    requestedBy:  message.author.username,
                    searchEngine: QueryType.AUTO
                })

                if (result.tracks.length === 0) return message.channel.send('No results')
    
                const song = result.tracks[0]
                await queue.addTrack(song)
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}`})
            })

        } else if (args[0].startsWith('https://open.spotify.com/playlist/')) {
            let url = args[0]
            await getTracks(url)
            .then(async (data) => {
                embed
                    .setDescription(`Spotify playlist has been added to the Queue`)
                message.channel.send({
                    embeds: [embed]
                })

                for (const track of data) {
                    const artist = JSON.parse(JSON.stringify(track.artists))[0]
                    
                    let searchTerms
                    if (artist) {
                        searchTerms = track.name + artist.name
                    } else {
                        searchTerms = track.name
                    }
                    const result = await client.player.search(searchTerms, {
                        requestedBy:  message.author.username,
                        searchEngine: QueryType.AUTO
                    })

                    if (result.tracks.length === 0) return message.channel.send('No results')
                
                    const song = result.tracks[0]
                    await queue.addTrack(song)
                }
                
                embed
                    .setDescription(`Spotify playlist has been added to the Queue`)
            })

        } else {
            let searchTerms = args.join(' ')
            console.log('search')
            const result = await client.player.search(searchTerms, {
                requestedBy:  message.author.username,
                searchEngine: QueryType.AUTO
            })
            if (result.tracks.length === 0) return message.channel.send('No results')
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})

            //playResponse(queue, message, embed)
        }

        if (!queue.playing) await queue.play()
        message.channel.send({
            embeds: [embed]
        })
    }
}