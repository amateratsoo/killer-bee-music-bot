import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'

import { noQueueMessage } from '../utils/no-queue-message'


type Subcommand = 'all' | 'current' | 'next'

const data =
  new SlashCommandBuilder()
    .setName('queue')
    .setDescription('📄 informações referentes a lista atual')
    .addSubcommand(subcommand => {
      subcommand
        .setName('all')
        .setDescription('📄 mostra todas as músicas restantes na lista')

      return subcommand
    })
    .addSubcommand(subcommand => {
      subcommand
        .setName('current')
        .setDescription('🐛 mostra a música que está tocando no momento')

      return subcommand
    })
    .addSubcommand(subcommand => {
      subcommand
        .setName('next')
        .setDescription('🦋 mostra a próxima música na fila')

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

  if (subcommand == 'all') {
    const songs = queue.tracks.data

    const description = 
      `👉 **${currentSong?.title}** | 🎤 **${currentSong?.author}** 

      ${songs.map(song => `> **${song.title}** | 🎤 **${song.author}**`).join('\n \n')}
      `


    const embed =
      new EmbedBuilder()
        .setColor('#fb923c')
        .setTitle('**📄 Músicas na fila atual**')
        .setDescription(description)
        .setFooter({ text: `requisitado por ${interaction.user.username}` })
        .setTimestamp()

    return interaction.reply({ embeds: [embed] })
  }

  else if (subcommand == 'current') {
    const embed = 
    new EmbedBuilder()
      .setColor('#f97316')
      .setDescription(`🎹 música atual **${currentSong?.title}** | 🎤 **${currentSong?.author}**`)
      .setThumbnail(currentSong.thumbnail)
      .setTimestamp()
      .setFooter({ text: `🫡 requisitado por ${interaction.user.username}` })


    return interaction.reply({ embeds: [embed] })
  }

  else if (subcommand == 'next') {
    const nextSong = queue.tracks.data[0]

    if (!nextSong) return interaction.reply('> 😥 Não há próxima música')

    const embed = 
    new EmbedBuilder()
      .setColor('#ea580c')
      .setDescription(`🎹 próxima música **${nextSong?.title}** | 🎤 **${nextSong?.author}**`)
      .setThumbnail(nextSong.thumbnail)
      .setTimestamp()
      .setFooter({ text: `🫡 requisitado por ${interaction.user.username}` })


    return interaction.reply({ embeds: [embed] })
  }
}


export {
  data,
  execute
}
