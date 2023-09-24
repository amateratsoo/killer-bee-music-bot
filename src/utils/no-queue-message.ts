function noQueueMessage(interaction) {
  interaction.reply({
    content: '> 😥 Lista de reprodução inexistente',
    ephemeral: true
  })
}


export {
  noQueueMessage
}
