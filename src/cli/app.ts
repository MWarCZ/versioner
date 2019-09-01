import minimist from 'minimist'

import {
  FileType,
  nextVersion,
  NextVersionConfig,
  readVersion,
  ReadVersionConfig,
  ReleaseType,
  VersionResult,
  writeVersion,
  WriteVersionConfig,
} from '..'
import { version as VERSIONER_VERSION } from '../../package.json'
import logger from '../logger'

type CLIActivity = 'version'|'help'|'next'|'set'|'get'|'unknown'
interface ParsedArgs extends minimist.ParsedArgs {
  set: string,
  tag: string,
  next: string,
  help: boolean,
  version: boolean,
  preid: string,
  'file-format': string,
}

export function parseArgs(nodeProcessArgv: string[]): ParsedArgs {
  const options = {
    alias: {
      s: 'set',
      t: 'tag',
      n: 'next',
      h: 'help',
      v: 'version',
      f: 'file-format',
    },
    string: [
      'set',
      'tag',
      'next',
      'preid',
      'file-format',
    ],
    boolean: [
      'help',
      'version',
    ],
    default: {
      tag: 'version',
      'file-format': 'json',
    },
  }
  const argv = minimist(nodeProcessArgv.slice(2), options)
  return <ParsedArgs> argv
}

export function selectCLIActitity(argv:ParsedArgs):CLIActivity {
  // High priority
  if (argv.help) return 'help'
  // if (!['json'].includes(argv['file-format'])) return 'unknown'

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

export function printHelp(lang:string = 'cs-cz') {
  if (lang === 'cs-cz') {
    logger.info(`
POUŽITÍ:
  versioner <file.json ...> [-s | --set <version>] [-t | --tag <path.to.version>] [-f | --file-format <format>]
  versioner <file.json ...> [-n | --next <level>] [--preid <preid>] [-t | --tag <path.to.version>] [-f | --file-format <format>]
  versioner [-v | --version]
  versioner [-h | --help]

PŘEPÍNAČE:
  -s, --set
  \tNastaveni konkrétní verze v daném souboru/souborech.
  \tVerze musí být ve formátu 'Major.Minor.Patch'.
  -n, --next
  \tZvýší verzi v souboru dle zadané úrovně.
  \tMožné úrovně:
  \t  major, minor, patch, prerelease, premajor, preminor, prepatch
  -t, --tag
  \tZmění cestu, kde je hledána verze v souboru.
  \tPokud není použit přepínač, tak výchozí cesta je 'version'.
  \tPomocí teček je možné zanořovat se hlouběji do struktury souboru.
  --preid
  \tOznačení použíté pro předbežné verze (např. alfa, beta).
  -f, --file-format
  \tUrčeni jakého typu/formátu jsou soubory.
  \tPodporované hodnoty: 'json'
  -v, --version
  \tVypíše verzi používaného nástroje.
  -h, --help
  \tVypíše tuto napovědu.
    `)
  } else {
    logger.info(`
Help is not in other languages (only 'cs-cz').
    `)
  }
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
    printHelp()

  } else if (cliActivity === 'set') {
    // Ulozi novou verzi do souboru
    const results = await Promise.all(
      argv._.map(
        path => {
          const config: WriteVersionConfig = {
            newVersion: argv.set,
            pathToFile: path,
            pathToVersionInFile: argv.tag,
            fileType: <FileType> argv['file-format'],
          }
          return writeVersion(config).catch(err => err)
        },
      ),
    )
    results.forEach((value: VersionResult|Error, index) => {
      if (value instanceof Error) {
        logger.error(`${argv._[index]}\n${value.message}`)
        exitCode = 2
      } else {
        logger.info(`${argv._[index]}\n${value.oldVersion} -> ${value.newVersion}`)
      }
    })

  } else if (cliActivity === 'next') {
    const results = await Promise.all(
      argv._.map(
        path => {
          const config: NextVersionConfig = {
            releaseType: <ReleaseType> argv.next || 'patch',
            pathToFile: path,
            pathToVersionInFile: argv.tag,
            identifier: argv.preid,
            fileType: <FileType> argv['file-format'],
          }
          return nextVersion(config).catch(err => err)
        },
      ),
    )
    results.forEach((value: VersionResult|Error, index) => {
      if (value instanceof Error) {
        logger.error(`${argv._[index]}\n${value.message}`)
        exitCode = 2
      } else {
        logger.info(`${argv._[index]}\n${value.oldVersion} -> ${value.newVersion}`)
      }
    })
  } else if (cliActivity === 'get') {
    // Ziska a vypise verze v souborech
    const results = await Promise.all(
      argv._.map(
        path => {
          const config: ReadVersionConfig = {
            pathToFile: path,
            pathToVersionInFile: argv.tag,
            fileType: <FileType> argv['file-format'],
          }
          return readVersion(config).catch(err => err)
        },
      ),
    )
    results.forEach((value: VersionResult|Error, index) => {
      if (value instanceof Error) {
        logger.error(`${argv._[index]}\n${value.message}`)
        exitCode = 2
      } else {
        logger.info(`${argv._[index]}\n${value.oldVersion}`)
      }
    })

  } else {
    logger.error('Neplatna kombinace parametru.')
    exitCode = 1
  }

  return exitCode
}

