import dotenv from 'dotenv'
import { Client, Events, Collection, GatewayIntentBits as Intents } from 'discord.js'
import { Player, PlayerEvent } from 'discord-player'

import { setCommandsIntoCollection } from './utils/set-commands-into-collection'
import { commandHandler } from './utils/command-handler'
import { getPathLocation } from './utils/get-path-location'

dotenv.config()

class SuperClient extends Client {
  commands = new Collection()
  player = new Player(this, {
    ytdlOptions: 'highestaudio',
    highWaterMark: 1 << 25
  })
}

export const client = new SuperClient({
  intents: [
    Intents.Guilds,
    Intents.GuildMembers,
    Intents.GuildMessages,
    Intents.GuildVoiceStates
  ]
})


const token = process.env.TOKEN as string


const pathLocation = getPathLocation('src', ['commands'])
const commandPath = commandHandler(pathLocation)

setCommandsIntoCollection({
  commandsPath: commandPath,
  relativePath: '../commands'
})


client.player.extractors.loadDefault(ext => ext == 'YouTubeExtractor')


client.once(Events.ClientReady, bot => {
  console.clear()
  console.log(`Logged in as ${bot.user.tag}`)
})

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return

  const voiceChannel = interaction.member.voice.channel // discord.js didn´t type properly the interaction event

  if (!voiceChannel) {
    return interaction.reply('> 😰 Hey, você precisa de estar em um canal de voz para usar esse comando')
  }

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } 
  
  catch (error) {
    console.error(error)
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ 
        content: `😔 não foi possivel executar esse comando!
        🚧 **Motivo**: 
        > ${error}
        `,
        ephemeral: true 
      })
    } 
    
    else {
      await interaction.reply({ 
        content: `😔 não foi possivel executar esse comando!
        🚧 **Motivo**: 
        > ${error}
        `,
        ephemeral: true 
      })
    }
  }
})



client.login(token)
