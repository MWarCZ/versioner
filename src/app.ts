import minimist from 'minimist'

import { version as VERSIONER_VERSION } from '../package.json'
import logger from './logger'
import { nextVersion, readVersion, writeVersion } from './mainLib'

type CLIActivity = 'version'|'help'|'next'|'set'|'get'|'unknown'
interface ParsedArgs extends minimist.ParsedArgs {
  set: string,
  tag: string,
  next: string,
  help: boolean,
  version: boolean,
  preid: string,
}

export function parseArgs(nodeProcessArgv: string[]): ParsedArgs {
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
      'preid',
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
  return <ParsedArgs> argv
}

export function selectCLIActitity(argv:ParsedArgs):CLIActivity {
  // High priority
  if (argv.help) return 'help'

  const isVersion = !!argv.version
  const isNext = typeof argv.next === 'string'
  const isSet = typeof argv.set === 'string'
  const isPreid = typeof argv.preid === 'string'
  // Allowed combinations
  if ( isVersion && !isNext && !isSet && !isPreid) return 'version'
  if (!isVersion &&  isNext && !isSet) return 'next'
  if (!isVersion && !isNext &&  isSet && !isPreid) return 'set'
  if (!isVersion && !isNext && !isSet && !isPreid) return 'get'

  return 'unknown'
}

// ==========================================

export async function main(precessArgv:any):Promise<number> {
  const argv = parseArgs(precessArgv)
  const cliActivity = selectCLIActitity(argv)
  let exitCode = 0

  logger.debug(argv)
  logger.debug(`cliActivity: '${cliActivity}'`)

  if (cliActivity === 'version') {
    logger.info(VERSIONER_VERSION)

  } else if (cliActivity === 'help' || !argv._.length) {
    logger.info('\nNapoveda: ...\n')

  } else if (cliActivity === 'set') {
    // Ulozi novou verzi do souboru
    const results = await Promise.all(
      argv._.map(
        path => writeVersion(path, argv.tag, argv.set).catch(err => err),
      ),
    )
    results.forEach((value, index) => {
      const {oldVersion, newVersion} = value
      if (typeof newVersion === 'string') {
        logger.info(`${argv._[index]}\n${oldVersion} -> ${newVersion}`)
      } else {
        logger.error(`${argv._[index]}\n${value.message}`)
        exitCode = 2
      }
    })

  } else if (cliActivity === 'next') {
    const results = await Promise.all(
      argv._.map(
        path => nextVersion(path, argv.tag, argv.next || 'patch', argv.preid).catch(err => err),
      ),
    )
    results.forEach((value, index) => {
      const { oldVersion, newVersion } = value
      if (typeof newVersion === 'string') {
        logger.info(`${argv._[index]}\n${oldVersion} -> ${newVersion}`)
      } else {
        logger.error(`${argv._[index]}\n${value.message}`)
        exitCode = 2
      }
    })
  } else if (cliActivity === 'get') {
    // Ziska a vypise verze v souborech
    const results = await Promise.all(
      argv._.map(
        path => readVersion(path, argv.tag).catch(err => err),
      ),
    )
    results.forEach((value, index) => {
      if (typeof value === 'string') {
        logger.info(`${argv._[index]}\n${value}`)
      } else {
        logger.error(`${argv._[index]}\n${value.message}`)
        exitCode = 2
      }
    })

  } else {
    logger.error('Neplatna kombinace parametru.')
    exitCode = 1
  }

  return exitCode
}

