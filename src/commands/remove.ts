import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'

import { noQueueMessage } from '../utils/no-queue-message'


const data =
  new SlashCommandBuilder()
    .setName('remove')
    .setDescription('🔪 use para remover uma música da fila')
    .addSubcommand(subcommand => {
      subcommand
        .setName('song')
        .setDescription('🔪 remove a música da fila (todas as músicas depois dessa)')
        .addStringOption(option => {
          option
            .setName('posição')
            .setDescription('📄 a posição da música na fila (se não souber, use o commando `/queue all)`')
            .setRequired(true)

          return option
        })

      return subcommand
    })


async function execute(interaction) {
  const voiceChannel = interaction.member.voice.channel
  const { _hoistedOptions } = interaction.options

  const songPosition = _hoistedOptions[0].value
  const song = songPosition - 2 < 0 ? 0 : songPosition - 2

  const queue = useQueue(voiceChannel)

  if (!queue) {
    return noQueueMessage(interaction)
  }

  const songToRemove = queue.tracks.data[song]

  queue.removeTrack(songToRemove)

  const embed =
  new EmbedBuilder()
    .setColor('#ef4444')
    .setTitle(`🔪 **${songToRemove.title} | ${songToRemove.author}** foi removida da fila atual`)
    .setThumbnail(songToRemove.thumbnail)
    .setDescription(`**${interaction.user.username}** removeu **${songToRemove.title}**`)
    .setTimestamp()


  return interaction.reply({ embeds: [embed] })
}


export {
  data,
  execute
}
