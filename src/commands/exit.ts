import { SlashCommandBuilder } from 'discord.js'
import { useQueue } from 'discord-player'

import { noQueueMessage } from '../utils/no-queue-message'


const data =
  new SlashCommandBuilder()
    .setName('exit')
    .setDescription('🫡 expulsa o bot do canal de voz')


async function execute(interaction) {
  const voiceChannel = interaction.member.voice.channel

  const queue = useQueue(voiceChannel)

  if (!queue) {
    return noQueueMessage(interaction)
  }


  queue.delete()

  return interaction.reply('> 🫡 Adeus!!!')
}


export {
  data,
  execute
}
