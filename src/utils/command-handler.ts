import { type PathLike, readdirSync } from 'node:fs'

function commandHandler(path: PathLike) {
  const commands = 
    readdirSync(path)
      .filter(file => file.endsWith('.ts'))

  return commands
}


export {
  commandHandler
}
