const Discord = require('discord.js')
const { Client, GatewayIntentBits, Partials, IntentsBitField, EmbedBuilder } = require('discord.js')
const dotenv = require('dotenv')
const fs = require('fs')

const { DisTube } = require('distube')

dotenv.config()
const TOKEN = process.env.TOKEN
const SECRET = process.env.SECRET

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
]});

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false
})

client.slashcommands = new Discord.Collection()

const slashFiles = fs.readdirSync('./slash').filter(file => file.endsWith('.js'))
for (const file of slashFiles) {
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.name, slashcmd)
}

client.on('ready', () => {
    console.log(`Ready. Logged in as ${client.user.tag}`)
    //console.log(client.slashcommands)
})

client.on('messageCreate', (message) => {
    const prefix = '-'
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()
   
    if (command === 'p' || command === 'play') {
        client.slashcommands.get('play').execute(client, message, args)
    } else if (command === 'queue') {
        client.slashcommands.get('queue').execute(client, message, args)
    } else if (command === 'info') {
        client.slashcommands.get('info').execute(client, message)
    } else if (command === 'shuffle') {
        client.slashcommands.get('shuffle').execute(client, message)
    } else if (command === 'pause') {
        client.slashcommands.get('pause').execute(client, message)
    } else if (command === 'resume') {
        client.slashcommands.get('resume').execute(client, message)
    } else if (command === 'skip') {
        client.slashcommands.get('skip').execute(client, message)
    }  else if (command === 'clear') {
        client.slashcommands.get('clear').execute(client, message)
    } else if (command === 'stop') {
        client.slashcommands.get('stop').execute(client, message)
    } else if (command === 'loop') {
        client.slashcommands.get('loop').execute(client, message)
    } else if (command === 'unloop') {
        client.slashcommands.get('unloop').execute(client, message)
    }
})

client.distube
  .on('playSong', (queue, song) => {
    let embed = new EmbedBuilder()
    embed
        .setDescription(`**[${song.name}](${song.url})** is now playing`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.formattedDuration}`})
    queue.textChannel.send({
        embeds: [embed]
    })
  })

client.distube
  .on('addSong', (queue, song) => {
    let embed = new EmbedBuilder()
    embed
        .setDescription(`**[${song.name}](${song.url})** has been added to the queue`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.formattedDuration}`})
    queue.textChannel.send({
        embeds: [embed]
    })
  })

client.distube
  .on('addList', (queue, playlist) => {
    let embed = new EmbedBuilder()
    console.log(playlist)
    embed
        .setDescription(`**[${playlist.name}](${playlist.url})** has been added to the queue`)
        .setThumbnail(playlist.thumbnail)
        .setFooter({ text: `Youtube playlist`})
    queue.textChannel.send({
        embeds: [embed]
    })
  })

client.distube
  .on('searchNoResult', (message, query) =>
  message.channel.send(`No result found for \`${query}\`!`)
)


client.login(TOKEN)