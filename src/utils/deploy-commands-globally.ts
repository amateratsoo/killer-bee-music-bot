import dotenv from 'dotenv'
import { REST, Routes } from 'discord.js'

import { commandHandler } from './command-handler'
import { getPathLocation } from './get-path-location'

dotenv.config()

async function deployCommands({ relativePath, commandsPath, token, clientId }: {
  relativePath: string
  commandsPath: string[]
  token: string
  clientId: string
}) {
  // commandPath is an array that includes each different path with a
  // slash command script, so we need to search for the commands
  // and then loop over it.

  const commands = []

  for (const path of commandsPath) {
    const { data } = await import(`${relativePath}/${path}`)

    commands.push(data.toJSON())
  }


  const rest = new REST().setToken(token)

  async function deploy() {
    console.clear()

    try {
      console.log(`[global] 🚧 Started refreshing ${commands.length} application (/) commands.`)
  
      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      )
  
      console.log(`[global] 🎉 Successfully reloaded ${data.length} application (/) commands.`)
    } catch (error) {
      console.error(error)
    }
  }

  deploy()
}

const token = process.env.TOKEN as string
const clientId = process.env.CLIENT_ID as string

const pathLocation = getPathLocation('src', ['commands'])
const commandPath = commandHandler(pathLocation)

deployCommands({
  token,
  clientId,
  commandsPath: commandPath,
  relativePath: '../commands'
})


export {
  deployCommands
}
