import minimist from 'minimist'

import { FileType, nextVersion, readVersion, ReleaseType, writeVersion } from '..'
import { version as VERSIONER_VERSION } from '../../package.json'
import logger from '../logger'

type CLIActivity = 'version'|'help'|'next'|'set'|'get'|'unknown'
interface ParsedArgs extends minimist.ParsedArgs {
  set: string,
  tag: string,
  next: string,
  help: boolean | string,
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
  // High priority activity
  if (argv.help) return 'help'
  // May exist
  const isVersion = !!argv.version
  const isNext = typeof argv.next === 'string'
  const isSet = typeof argv.set === 'string'
  const isPreid = typeof argv.preid === 'string'
  // Must exist
  const isTag = typeof argv.tag === 'string'
  const isFileFormat = typeof argv['file-format'] === 'string'
  // Not allowed combinations
  if (!isTag || !isFileFormat) return 'unknown'
  // Allowed combinations
  if ( isVersion && !isNext && !isSet && !isPreid) return 'version'
  if (!isVersion &&  isNext && !isSet) return 'next'
  if (!isVersion && !isNext &&  isSet && !isPreid) return 'set'
  if (!isVersion && !isNext && !isSet && !isPreid) return 'get'

  return 'unknown'
}

export function printHelp(lang:any = 'en') {
  if (lang === 'cz' || lang === 'cs') {
    logger.info(`
POUŽITÍ:
  versioner <file.json ...> [-s | --set <version>] [-t | --tag <path.to.version>] [-f | --file-format <format>]
  versioner <file.json ...> [-n | --next <level>] [--preid <preid>] [-t | --tag <path.to.version>] [-f | --file-format <format>]
  versioner [-v | --version]
  versioner [-h | --help [<lang>]]

PŘEPÍNAČE:
  -s, --set
  \tNastaveni konkrétní verze v daném souboru/souborech.
  \tVerze musí být ve formátu 'Major.Minor.Patch'.
  -n, --next
  \tZvýší verzi v souboru dle zadané úrovně.
  \tMožné úrovně:
  \t  major, minor, patch, prerelease, premajor, preminor, prepatch
  -t, --tag
  \tZmění cestu k nalezení verze v souboru.
  \tPokud není použito, tak výchozí cesta je 'version'.
  \tKroky v cestě jsou doděleny tečkami.
  --preid
  \tIdentifikátor, který se použije k předponě v předběžné verzi.
  -f, --file-format
  \tUrčeni typu/formátu soubory.
  \tPodporované hodnoty: 'json'
  -v, --version
  \tVytiskne verzi tohoto nástroje.
  -h, --help
  \tVypíše tuto napovědu.
  \t'-h cz' | '-h cs': Nápověda v českém jazyku.
  \t'-h' | '-h en': Nápověda v anglickém jazyku.
    `)
  } else {
    logger.info(`
USAGE:
  versioner <file.json ...> [-s | --set <version>] [-t | --tag <path.to.version>] [-f | --file-format <format>]
  versioner <file.json ...> [-n | --next <level>] [--preid <preid>] [-t | --tag <path.to.version>] [-f | --file-format <format>]
  versioner [-v | --version]
  versioner [-h | --help [<lang>]]

OPTIONS:
  -s, --set
  \tSet specific version in given file(s).
  \tVersion must be in format 'Major.Minor.Patch'.
  -n, --next
  \tIncreases version in file according to specified level.
  \Possible levels:
  \t  major, minor, patch, prerelease, premajor, preminor, prepatch
  -t, --tag
  \tChanges path to find version in file.
  \tIf not used, default path is 'version'.
  \tSteps in path are separated by dots.
  --preid
  \tIdentifier to use for prefix in pre-release version.
  -f, --file-format
  \tSpecify file type/format.
  \tSupported values: 'json'
  -v, --version
  \tPrint version of this tool.
  -h, --help
  \tPrint this help.
  \t'-h cz' | '-h cs': Help in Czech language.
  \t'-h' | '-h en': Help in English language.
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
    printHelp(argv.help)
  } else if (cliActivity === 'set') {
    // Save new version into files.
    await Promise.all(argv._.map(path => {
      return writeVersion({
        newVersion: argv.set,
        pathToFile: path,
        pathToVersionInFile: argv.tag,
        fileType: <FileType> argv['file-format'],
      }).then(value => {
        logger.info(`${path}\n${value.oldVersion} -> ${value.newVersion}`)
      }).catch(err => {
        logger.error(`${path}\n${err.message}`)
        exitCode = 2
      })
    }))
  } else if (cliActivity === 'next') {
    // Generate and save new version for files.
    await Promise.all(argv._.map(path => {
      return nextVersion({
        releaseType: <ReleaseType> argv.next || 'patch',
        pathToFile: path,
        pathToVersionInFile: argv.tag,
        identifier: argv.preid,
        fileType: <FileType> argv['file-format'],
      }).then(value => {
        logger.info(`${path}\n${value.oldVersion} -> ${value.newVersion}`)
      }).catch(err => {
        logger.error(`${path}\n${err.message}`)
        exitCode = 2
      })
    }))
  } else if (cliActivity === 'get') {
    // Read and get version of files.
    await Promise.all(argv._.map(path => {
      return readVersion({
        pathToFile: path,
        pathToVersionInFile: argv.tag,
        fileType: <FileType> argv['file-format'],
      }).then(value => {
        logger.info(`${path}\n${value.oldVersion}`)
      }).catch(err => {
        logger.error(`${path}\n${err.message}`)
        exitCode = 2
      })
    }))
  } else {
    logger.error('Invalid parameter combination.')
    exitCode = 1
  }
  return exitCode
}

