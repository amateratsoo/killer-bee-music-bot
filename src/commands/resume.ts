import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue, GuildQueuePlayerNode } from 'discord-player'

import { noQueueMessage } from '../utils/no-queue-message'


const data =
  new SlashCommandBuilder()
    .setName('resume')
    .setDescription('⏯️ retoma a música atual')


async function execute(interaction) {
  const voiceChannel = interaction.member.voice.channel

  const queue = useQueue(voiceChannel)

  if (!queue) {
    return noQueueMessage(interaction)
  }

  const guildQueue = new GuildQueuePlayerNode(queue)
  const currentSong = queue.currentTrack

  if (guildQueue.isPlaying()) return interaction.reply('> 😅 A música já está tocando')

  guildQueue.resume()

  const embed =
    new EmbedBuilder()
      .setColor('#10b981')
      .setTitle(`⏯️ **${interaction.user.username}** retomou a música`)
      .setDescription(`🎹  Música atual **${currentSong?.title}**`)
      .setThumbnail(currentSong!.thumbnail)
      .setTimestamp()

  return interaction.reply({ embeds: [embed] })
}


export {
  data,
  execute
}
