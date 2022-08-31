//const { SlashCommandBuilder } = require('@discordjs/builders')
const fetch = require('isomorphic-unfetch')
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch)

const { generateDependencyReport } = require('@discordjs/voice')

console.log(generateDependencyReport());

module.exports = {
    name: 'play',
    description: 'Play songs from youtube or spotify',
    
    async execute(client, message, args) {
        if (!message.member.voice.channel) {
            return message.channel.send('You need to be in voice channel in order to play song')
        }

        if (args[0].startsWith('https://www.youtube.com/watch')) {
            let url = args[0]
            console.log(url)

            client.distube.play(message.member.voice.channel, url, {
                member: message.member,
                textChannel: message.channel,
                message
            })

        } else if (args[0].startsWith('https://www.youtube.com/playlist')) {
            let url = args[0]

            client.distube.play(message.member.voice.channel, url, {
                member: message.member,
                textChannel: message.channel,
                message
            })

        } else if (args[0].startsWith('https://open.spotify.com/track/')) {
            let url = args[0]
            await getPreview(url)
            .then(async (data) => {

                let searchTerms = data.title + data.artist
                client.distube.play(message.member.voice.channel, searchTerms, {
                    member: message.member,
                    textChannel: message.channel,
                    message
                })
            })

        } else if (args[0].startsWith('https://open.spotify.com/playlist/')) {
            let url = args[0]
            await getTracks(url)
            .then(async (data) => {
                message.channel.send('Na spotify playlist si musis pockat :/')

                // for (const track of data) {
                //     const artist = await JSON.parse(JSON.stringify(track.artists))[0]
                    
                //     let searchTerms
                //     if (artist) {
                //         searchTerms = track.name + artist.name
                //     } else {
                //         searchTerms = track.name
                //     }
                //     console.log(searchTerms)
                //     console.log(track.name)
                //     if (searchTerms.length !== 0) {
                //     client.distube.play(message.member.voice.channel, searchTerms, {
                //         member: message.member,
                //         textChannel: message.channel,
                //         message
                //     })  
                //     } 
                // }
            })

        } else {
            let searchTerms = args.join(' ')
            console.log('search')

            client.distube.play(message.member.voice.channel, searchTerms, {
                member: message.member,
                textChannel: message.channel,
                message
            })
        }
    }
}