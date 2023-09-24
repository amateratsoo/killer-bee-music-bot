import path from 'node:path'

function getPathLocation(dirname: string, stepsToTargetDir: string[]) {
  const pathLocation = path.join(dirname, ...stepsToTargetDir)

  return pathLocation
}


export {
  getPathLocation
}
