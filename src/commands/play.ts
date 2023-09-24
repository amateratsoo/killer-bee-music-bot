import { SlashCommandBuilder, Interaction, CacheType, EmbedBuilder } from 'discord.js'
import { useMainPlayer, useQueue } from 'discord-player'

const data = 
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('use para tocar algo automagicamente 🪄')
    .addSubcommand(subcommand => {
      subcommand
        .setName('song')
        .setDescription('🎉 tocar uma música')
        .addStringOption(option => {
          option
            .setName('url')
            .setDescription('✍️ a url da música no yt')
            .setRequired(true)

          return option
        })

      return subcommand
    })


async function execute(interaction) {
  const voiceChannel = interaction.member.voice.channel
  const player = useMainPlayer()


  const options = interaction.options._hoistedOptions[0]
  const query: string = options.value
  const queryRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/gm
  const isValidMusicVideoQuery = query.match(queryRegex)

  if (!isValidMusicVideoQuery) return interaction.reply(`> 😥 parece que **${query}** não é um link de música válido`)
  
  await interaction.deferReply()

  try {  
    const data = await player?.play(voiceChannel, query, {
      nodeOptions: {
        metadata: interaction
      }
    })


    const { title, author, thumbnail, duration } = data.track
    const queue = data.queue


    const embed = 
      new EmbedBuilder()
        .setColor('#6366f1')
        .setTitle(`**📌 ${title}**`)
        .setDescription(`música de ${author} | ${duration}`)
        .setThumbnail(thumbnail)
        .setTimestamp()
        .setFooter({ text: `🥳 adicionado por ${interaction.user.username}` })


    return interaction.followUp({ embeds: [embed] })
  }

  catch(error) {
    console.error(error)

    return interaction.followUp({ 
      content: `😰 algo deu errado!
      ---------
      🚧 **Motivo**: 
      > ${error}
      `, 
      ephemeral: true 
    })
  }
}


export {
  data,
  execute
}
