const Discord = require('discord.js')
const dotenv = require('dotenv')
const fs = require('fs')
const { Player } = require('discord-player')

dotenv.config()
const TOKEN = process.env.TOKEN

const client = new Discord.Client({ 
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        'GUILD_VOICE_STATES',
        "GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"
    ] 
})

client.slashcommands = new Discord.Collection()
client.player = new Player(client, {
    ytdloptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25
    }
})

const slashFiles = fs.readdirSync('./slash').filter(file => file.endsWith('.js'))
for (const file of slashFiles) {
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
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
    }
})

client.login(TOKEN)