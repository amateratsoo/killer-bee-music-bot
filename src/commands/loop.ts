import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue, QueueRepeatMode } from 'discord-player'

import { noQueueMessage } from '../utils/no-queue-message'


type Subcommand = 'start' | 'end'

const data = 
  new SlashCommandBuilder()
    .setName('loop')
    .setDescription('🔁 ativa/desativa a repetição da música atual')
    .addSubcommand(subcommand => {
      subcommand
        .setName('start')
        .setDescription('⏳ ativa o loop da música atual')

      return subcommand
    })
    .addSubcommand(subcommand => {
      subcommand
        .setName('end')
        .setDescription('⌛ desativa o loop da música atual')

      return subcommand
    })


async function execute(interaction) {
  const voiceChannel = interaction.member.voice.channel
  const { _subcommand } = interaction.options

  const subcommand: Subcommand = _subcommand

  const queue = useQueue(voiceChannel)


  if (!queue) {
    return noQueueMessage(interaction)
  }

  const currentSong = queue.currentTrack

  if (subcommand == 'start') {
    if (queue.repeatMode == QueueRepeatMode.TRACK) {
      return interaction.reply('> 😅 A música já está em loop')
    }

    queue.setRepeatMode(QueueRepeatMode.TRACK)

    const embed =
      new EmbedBuilder()
        .setColor('#10b981')
        .setTitle(`⏳ **${interaction.user.username}** colocou ${currentSong?.title} em loop`)
        .setDescription(`🎹  Música atual **${currentSong?.title}**`)
        .setThumbnail(currentSong.thumbnail)
        .setTimestamp()
  
  
    return interaction.reply({ embeds: [embed] })
  }

  else if (subcommand == 'end') {
    if (queue.repeatMode == QueueRepeatMode.OFF) {
      return interaction.reply('> 😅 A música não está em loop')
    }

    queue.setRepeatMode(QueueRepeatMode.OFF)

    const embed =
      new EmbedBuilder()
        .setColor('#ef4444')
        .setTitle(`⌛ **${interaction.user.username}** desativou o loop de ${currentSong?.title}`)
        .setDescription(`🎹  Música atual **${currentSong?.title}**`)
        .setThumbnail(currentSong.thumbnail)
        .setTimestamp()
  
  
    return interaction.reply({ embeds: [embed] })
  }
}


export {
  data,
  execute
}
