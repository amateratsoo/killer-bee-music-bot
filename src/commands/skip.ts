import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue, GuildQueuePlayerNode, QueueRepeatMode } from 'discord-player'

import { noQueueMessage } from '../utils/no-queue-message'


const data =
  new SlashCommandBuilder()
    .setName('skip')
    .setDescription('⏩ passa para a próxima música na fila')
    .addStringOption(option => {
      option
        .setName('songs')
        .setDescription('🤔 quantas músicas deseja pular? (mínimo 1)')
        .setRequired(true)

      return option
    })


async function execute(interaction) {
  const voiceChannel = interaction.member.voice.channel
  const queue = useQueue(voiceChannel)

  const options = interaction.options._hoistedOptions[0]
  const songsToSkip = Number(options.value)

  if (songsToSkip <= 0) {
    return interaction.reply({ content: `> 🤔 não faz sentido pular ${songsToSkip} músicas`, ephemeral: true })
  }

  if (!queue) {
    return noQueueMessage(interaction)
  }

  if (queue.repeatMode != QueueRepeatMode.OFF) {
    queue.setRepeatMode(QueueRepeatMode.OFF)
  }

  const guildQueue = new GuildQueuePlayerNode(queue)
  const targetSong = queue.tracks.data[songsToSkip - 1]

  if (!targetSong) {
    return interaction.reply('> 😥 Impossível pular, já está na última música')
  }

  guildQueue.skipTo(targetSong)

  const embed =
    new EmbedBuilder()
      .setColor('#3b82f6')
      .setTitle(`⏩ **${interaction.user.username}** pulou ${songsToSkip} música(s)`)
      .setDescription(`🎹  Música atual **${targetSong?.title}**`)
      .setThumbnail(targetSong.thumbnail)
      .setTimestamp()


  return interaction.reply({ embeds: [embed] })
}


export {
  data,
  execute
}
