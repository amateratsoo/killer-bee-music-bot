import { client } from '../index'

async function setCommandsIntoCollection({ relativePath, commandsPath }: {
  relativePath: string
  commandsPath: string[]
}) {
  // commandPath is an array that includes each different path with a
  // slash command script, so we need to search for the commands
  // and then loop over it.

  for (const path of commandsPath) {
    const { data, execute } = await import(`${relativePath}/${path}`)

    client.commands.set(data.name, { data, execute })
  }

  console.log(`🎉 Successfully put ${commandsPath.length} (/) commands into the bot.`)
}


export {
  setCommandsIntoCollection
}
