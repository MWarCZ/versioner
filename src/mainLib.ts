import { inc, ReleaseType, valid } from 'semver'

import { FileType, readObjectFromFile, writeObjectToFile } from './fileUtils'

export { ReleaseType } from 'semver'

export { FileType } from './fileUtils'

export interface VersionResult {
  oldVersion: string | undefined,
  newVersion: string | undefined,
}
export interface ReadVersionConfig {
  pathToFile: string,
  pathToVersionInFile?: string,
  fileType?: FileType,
}
export interface WriteVersionConfig {
  newVersion: string,
  pathToFile: string,
  pathToVersionInFile?: string,
  fileType?: FileType,
}
export interface NextVersionConfig {
  releaseType: ReleaseType,
  pathToFile: string,
  pathToVersionInFile?: string,
  fileType?: FileType,
  identifier?: string,
}

const semver = {
  valid,
  inc,
}

/**
 * Najde a vrati hodnotu v danem objektu dle cesty pokud existuje.
 * @param objectWithData JS objekt ve kterem ma byt hledana hodnota.
 * @param pathToDataInFile Cesta pro nalezeni mista s hodnotou v JS objektu.
 */
export function getDataFromDataObject(
  objectWithData: any,
  pathToDataInFile: string,
): any {
  const stepsToDataInFile: string[] = pathToDataInFile.split('.')
  const data: string = stepsToDataInFile.reduce(
    // @ts-ignore
    (tmp: any | undefined, step: string) => tmp && tmp[step],
    objectWithData,
  )
  return data
}
/**
 * Pokusi se vlozit novou hodnotu do predaneho JS objektu na danou cestu.
 * @param newData Nova hodnota, ktera bude vlozena do objektu.
 * @param objectWithData JS objekt do ktereho bude vlozena hodnota.
 * @param pathToDataInFile Cesta pro nalezeni mista pro vlozeni hodnoty v JS objektu.
 */
export function setDataToDataObject(
  newData: any,
  objectWithData: any,
  pathToDataInFile: string,
  ): any {
  const stepsToDataInFile: string[] = pathToDataInFile.split('.')
  const result: any = stepsToDataInFile.reduce(
    // @ts-ignore
    (tmp, step, index: number) => {
      if (typeof tmp === 'object') {
        if (index === stepsToDataInFile.length - 1) {
          // Posledni krok => Vloz sem nova data
          tmp[step] = newData
        } else if (typeof tmp[step] === 'undefined') {
          // Pokud neexistuje nic, tak vytvor.
          tmp[step] = {}
        }
        return tmp[step]
      }
      return undefined
    },
    objectWithData,
  )
  return result
}

// ============================================================

/**
 * Precte verzi ulozenou v souboru.
 * @param pathToFile Cesta k souboru.
 * @param pathToVersionInFile Cesta pro nalezeni verze v souboru. (pr. `ver`, `info.version`, `path.to.version`)
 * @param fileType Typ souboru (napr. json).
 */
export async function readVersion({
    pathToFile,
    pathToVersionInFile = 'version',
    fileType = 'json',
}: ReadVersionConfig ): Promise<VersionResult> {
  let data: any = await readObjectFromFile(pathToFile, fileType)
  const version = getDataFromDataObject(data, pathToVersionInFile)
  if (typeof version !== 'string') {
    throw new Error(`Not found version in file '${pathToFile}' on '${pathToVersionInFile}'`)
  }
  if (!semver.valid(version)) {
    throw new Error(`Not found valid version in file '${pathToFile}' on '${pathToVersionInFile}' is '${version}'.`)
  }
  return { oldVersion: version, newVersion: undefined }
}
/**
 * Zapise verzi do souboru.
 * @param newVersion Verze, ktera bude zapsana do souboru.
 * @param pathToFile Cesta k souboru.
 * @param pathToVersionInFile Cesta pro nalezeni mista v souboru, kam bude zapsana verze. (pr. `ver`, `info.version`, `path.to.version`)
 * @param fileType Typ souboru (napr. json).
 */
export async function writeVersion({
  newVersion,
  pathToFile,
  pathToVersionInFile = 'version',
  fileType = 'json',
}: WriteVersionConfig): Promise<VersionResult> {
  if (!semver.valid(newVersion)) {
    throw new Error(`'${newVersion}' is not valid version.`)
  }
  let data: any = await readObjectFromFile(pathToFile, fileType)
  const oldVersion = getDataFromDataObject(data, pathToVersionInFile)
  setDataToDataObject(newVersion, data, pathToVersionInFile)
  await writeObjectToFile(pathToFile, data, fileType)
  return { oldVersion, newVersion }
}
/**
 * Precte puvodni verzi ze souboru ze ktere vygeneruje novou verzi, kterou zapise do souboru.
 * @param releaseType Typ vydani urcujici, jak se verze zmeni (patch, minor, major, prerelease, pre...).
 * @param pathToFile Cesta k souboru.
 * @param pathToVersionInFile Cesta pro naleyeni mista s verzi souboru, ktera bude zmenena. (pr. `ver`, `info.version`, `path.to.version`)
 * @param identifier Identifikator pro typy vydani obsahujici prefix 'pre' (prereleace, prepatch, preminor, premajor).
 * @param fileType Typ souboru (napr. json).
 */
export async function nextVersion({
  releaseType,
  pathToFile,
  pathToVersionInFile = 'version',
  fileType = 'json',
  identifier,
}: NextVersionConfig): Promise<VersionResult> {
  let data: any = await readObjectFromFile(pathToFile, fileType)
  const oldVersion = getDataFromDataObject(data, pathToVersionInFile)
  if (typeof oldVersion !== 'string') {
    throw new Error(`Not found version in file '${pathToFile}' on '${pathToVersionInFile}'.`)
  }
  const newVersion = semver.inc(oldVersion, releaseType, undefined, identifier)
  if (typeof newVersion !== 'string') {
    throw new Error(`Not possible increase version from '${oldVersion}' with release type '${releaseType}'.`)
  }

  setDataToDataObject(newVersion, data, pathToVersionInFile)
  await writeObjectToFile(pathToFile, data, fileType)
  return { oldVersion, newVersion }
}
