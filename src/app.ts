// Project: versioner
// File: src/app.ts
import minimist from 'minimist'
import * as semver from 'semver'

import { readFromJsonFile } from './fileUtils'
import logger from './logger'

export function parseArgs(nodeProcessArgv:string[]) {
  const options = {
    alias: {
      s: 'set',
      t: 'tag',
      n: 'next',
      h: 'help',
      v: 'version',
    },
    string: [
      'set',
      'tag',
      'next',
    ],
    boolean: [
      'help',
      'version',
    ],
    default: {
      tag: 'version',
    },
  }
  const argv = minimist(nodeProcessArgv.slice(2), options)
  return argv
}

export function getVersionFromDataObject(objectWithVersion:any, pathToVersionInFile:string):string|undefined {
  const stepsToVersionInFile: string[] = pathToVersionInFile.split('.')
  const version: string = stepsToVersionInFile.reduce(
    // @ts-ignore
    (ver: string | { [key: string]: string } | undefined, step: string) => ver && ver[step],
    objectWithVersion,
  )
  return (typeof version === 'string') ? version : undefined
}

export function setVersionToDataObject(objectWithVersion: any, pathToVersionInFile: string, newVersion: string):string|undefined {
  const stepsToVersionInFile: string[] = pathToVersionInFile.split('.')
  const result:string|undefined = stepsToVersionInFile.reduce(
    // @ts-ignore
    (ver, step, index:number) => {
      if (typeof ver === 'object') {
        if (index === stepsToVersionInFile.length - 1) {
          // Posledni krok => Vloz sem novou verzi
          ver[step] = newVersion
        } else if (typeof ver[step] === 'undefined') {
          // Pokud neexistuje nic, tak vytvor.
          ver[step] = {}
        }
        return ver[step]
      }
      return undefined
    },
    objectWithVersion,
  )
  return result
}

export async function runForSingleFile(path:string, argv:any):Promise<number> {
  let data:any
  // Read data from json file
  try {
    data = await readFromJsonFile(path)
  } catch (err) {
    logger.error(`Unable read from file '${path}'.`, err)
    return 1
  }
  // ...
  const version = getVersionFromDataObject(data, argv.tag)
  if (typeof version !== 'string' || !semver.valid(version)) {
    logger.error(`Not found valid version in file '${path}' on '${argv.tag}'`)
    return 2
  }
  logger.info('Old version:', version)
  const newVersion = semver.inc(version, 'patch')
  logger.info('New version:', newVersion)
  if (newVersion) {
    setVersionToDataObject(data, argv.tag, newVersion)
    logger.debug(data)
  }
  // Write data to json file
  try {
    // const saved = await writeToJsonFile(path, data)
  } catch (err) {
    logger.error(`Unable write to file '${ path }'.`, err)
    return 3
  }
  return 0
}
export function runForMoreFiles(paths:string[], argv:any) {
  return Promise.all(paths.map((path) => runForSingleFile(path, argv)))
}


export function run():number {
  const argv = parseArgs(process.argv)

  logger.debug('init')
  logger.debug(`${argv.set} => ${semver.inc(argv.set, 'patch')}`)

  if (argv.help) {
    logger.info('Napoveda: ...')
  } else if (argv.version) {
    logger.info(process.env.npm_package_version)
  } else {
    logger.debug(argv._)
    // const result = runForMoreFiles(argv._, argv)
    let data = {
      a:1,
      b:'b',
      c: {
        a: 2,
        b: 'B',
        c: {
          a: 3,
          b: 'Bb',
        },
      },
    }
    logger.debug(data)
    logger.debug('r:', setVersionToDataObject(data, argv.tag, 'version'))
    logger.debug(data)
  }
  return 0
}

