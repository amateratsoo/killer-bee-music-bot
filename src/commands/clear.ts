import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'

import { noQueueMessage } from '../utils/no-queue-message'


const data =
  new SlashCommandBuilder()
    .setName('clear')
    .setDescription('🧽 limpa a fila de reprodução atual (todas as músicas depois dessa)')


async function execute(interaction) {
  const voiceChannel = interaction.member.voice.channel

  const queue = useQueue(voiceChannel)

  if (!queue) {
    return noQueueMessage(interaction)
  }

  queue.clear()

  const embed =
    new EmbedBuilder()
      .setColor('#ef4444')
      .setTitle(`🧽 **${interaction.user.username}** limpou a fila atual`)
      .setTimestamp()


  return interaction.reply({ embeds: [embed] })
}


export {
  data,
  execute
}
