import * as semver from 'semver'

import { readObjectFromFile, writeObjectToFile } from './fileUtils'

/**
 * Najde a vrati hodnotu verze v danem objektu dle cesty pokud existuje.
 * @param objectWithVersion JS objekt ve kterem bude hledana verze.
 * @param pathToVersionInFile Cesta pro nalezeni mista s verzi v JS objektu.
 */
export function getVersionFromDataObject(objectWithVersion: any, pathToVersionInFile: string): string | undefined {
  const stepsToVersionInFile: string[] = pathToVersionInFile.split('.')
  const version: string = stepsToVersionInFile.reduce(
    // @ts-ignore
    (ver: string | { [key: string]: string } | undefined, step: string) => ver && ver[step],
    objectWithVersion,
  )
  return (typeof version === 'string') ? version : undefined
}
/**
 * Pokusi se vlozit novou verzi do predaneho JS objektu na danou cestu.
 * @param objectWithVersion JS objekt do ktereho bude vlozena verze.
 * @param pathToVersionInFile Cesta pro nalezeni mista pro vlozeni verze v JS objektu.
 * @param newVersion Nova verze, ktera bude vlozena do objektu.
 */
export function setVersionToDataObject(objectWithVersion: any, pathToVersionInFile: string, newVersion: string): string | undefined {
  const stepsToVersionInFile: string[] = pathToVersionInFile.split('.')
  const result: string | undefined = stepsToVersionInFile.reduce(
    // @ts-ignore
    (ver, step, index: number) => {
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

// ============================================================

/**
 * Precte verzi ulozenou v souboru.
 * @param pathToFile Cesta k souboru.
 * @param pathToVersionInFile Cesta pro nalezeni verze v souboru.
 * @param fileType Typ souboru (napr. json).
 */
export async function readVersion(pathToFile: string, pathToVersionInFile: string, fileType: string = 'json') {
  let data: any = await readObjectFromFile(pathToFile, fileType)
  const version = getVersionFromDataObject(data, pathToVersionInFile)
  if (typeof version !== 'string') {
    throw new Error(`Not found version in file '${pathToFile}' on '${pathToVersionInFile}'`)
  }
  if (!semver.valid(version)) {
    throw new Error(`Not found valid version in file '${pathToFile}' on '${pathToVersionInFile}' is '${version}'.`)
  }
  return version
}
/**
 * Zapise verzi do souboru.
 * @param pathToFile Cesta k souboru.
 * @param pathToVersionInFile Cesta pro nalezeni mista v souboru, kam bude zapsana verze.
 * @param newVersion Verze ktera bude zapsana do souboru.
 * @param fileType Typ souboru (napr. json).
 */
export async function writeVersion(pathToFile: string, pathToVersionInFile: string, newVersion: string, fileType: string = 'json') {
  if (!semver.valid(newVersion)) {
    throw new Error(`'${newVersion}' is not valid version.`)
  }
  let data: any = await readObjectFromFile(pathToFile, fileType)
  const oldVersion = getVersionFromDataObject(data, pathToVersionInFile)
  setVersionToDataObject(data, pathToVersionInFile, newVersion)
  await writeObjectToFile(pathToFile, data, fileType)
  return { oldVersion, newVersion }
}
/**
 * Precte puvodni verzi ze souboru ze ktere vygeneruje novou verzi, kterou zapise do souboru.
 * @param pathToFile Cesta k souboru.
 * @param pathToVersionInFile Cesta pro naleyeni mista s verzi souboru, ktera bude zmenena.
 * @param releaseType Typ vydani urcujici, jak se verze zmeni (patch, minor, major, prerelease, pre...).
 * @param identifier Identifikator pro typy vydani obsahujici prefix 'pre' (prereleace, prepatch, preminor, premajor).
 * @param fileType Typ souboru (napr. json).
 */
export async function nextVersion(pathToFile: string, pathToVersionInFile: string, releaseType: string, identifier?: string, fileType: string = 'json') {

  let data: any = await readObjectFromFile(pathToFile, fileType)
  const oldVersion = getVersionFromDataObject(data, pathToVersionInFile)
  if (typeof oldVersion !== 'string') {
    throw new Error(`Not found version in file '${pathToFile}' on '${pathToVersionInFile}'.`)
  }
  const newVersion = semver.inc(oldVersion, <semver.ReleaseType> releaseType, undefined, identifier)
  if (typeof newVersion !== 'string') {
    throw new Error(`Not possible increase version from '${oldVersion}' with release type '${releaseType}'.`)
  }

  setVersionToDataObject(data, pathToVersionInFile, newVersion)
  await writeObjectToFile(pathToFile, data, fileType)
  return { oldVersion, newVersion }
}
