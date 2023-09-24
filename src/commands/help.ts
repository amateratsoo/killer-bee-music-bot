import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'

import { noQueueMessage } from '../utils/no-queue-message'
import { commandHandler } from '../utils/command-handler'
import { getPathLocation } from '../utils/get-path-location'


interface CommandsProps {
  name: string
  description: string
}

const commands: CommandsProps[] = []

async function getCommandsData({ relativePath, commandsPath }: {
  relativePath: string
  commandsPath: string[]
}) {

  for (const path of commandsPath) {
    const { data } = await import(`${relativePath}/${path}`)

    commands.push({ name: data.name, description: data.description })
  }
}

const pathLocation = getPathLocation('src', ['commands'])
const commandPath = commandHandler(pathLocation)

getCommandsData({
  commandsPath: commandPath,
  relativePath: '../commands'
})

const data =
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('💎 lista dos comandos disponíveis')


async function execute(interaction) {
  const voiceChannel = interaction.member.voice.channel

  const queue = useQueue(voiceChannel)

  if (!queue) {
    return noQueueMessage(interaction)
  }

  const description = 
    `
    ${commands.map(command => `> (/) **${command.name}** -> **${command.description}**`).join('\n \n')}
    `


  const embed =
    new EmbedBuilder()
      .setColor('#fb923c')
      .setTitle(`**👋 Olá ${interaction.user.username}, aqui estão os comandos disponíveis para a minha utilização**`)
      .setThumbnail('https://w0.peakpx.com/wallpaper/443/515/HD-wallpaper-hyper-light-drifter-hyper-drifter-light-hi.jpg')
      .setDescription(description)
      .setFooter({ text: `requisitado por ${interaction.user.username}` })
      .setTimestamp()

  return interaction.reply({ embeds: [embed] })
}


export {
  data,
  execute
}
