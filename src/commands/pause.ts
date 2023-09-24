import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue, GuildQueuePlayerNode } from 'discord-player'

import { noQueueMessage } from '../utils/no-queue-message'


const data =
  new SlashCommandBuilder()
    .setName('pause')
    .setDescription('⏸️ pausa a música atual')


async function execute(interaction) {
  const voiceChannel = interaction.member.voice.channel

  const queue = useQueue(voiceChannel)

  if (!queue) {
    return noQueueMessage(interaction)
  }

  const guildQueue = new GuildQueuePlayerNode(queue)
  const currentSong = queue.currentTrack

  if (guildQueue.isPaused()) return interaction.reply('> 😅 A música já está pausada')

  guildQueue.pause()

  const embed =
    new EmbedBuilder()
      .setColor('#ef4444')
      .setTitle(`⏸️ **${interaction.user.username}** pausou a música`)
      .setDescription(`🎹  Música atual **${currentSong?.title}**`)
      .setThumbnail(currentSong!.thumbnail)
      .setTimestamp()

  return interaction.reply({ embeds: [embed] })
}


export {
  data,
  execute
}
