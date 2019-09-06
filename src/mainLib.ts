import { inc, ReleaseType, valid } from 'semver'

import { FileType, readObjectFromFile, writeObjectToFile } from './utils/readWriteFile'
import { extractDataFromObject, injectDataToObject } from './utils/objectUtils'

export { ReleaseType } from 'semver'

export { FileType } from './utils/readWriteFile'

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
 * Function reads version saved in file and returns it in `oldVersion`.
 * @param pathToFile Path to file.
 * @param pathToVersionInFile Path to find version in file. Default value is `version`. (e.g. `ver`, `info.version`, `path.to.version`)
 * @param fileType File type. Default value is `json`.
 */
export async function readVersion({
    pathToFile,
    pathToVersionInFile = 'version',
    fileType = 'json',
}: ReadVersionConfig ): Promise<VersionResult> {
  let data: any = await readObjectFromFile(pathToFile, fileType)
  const version = extractDataFromObject(data, pathToVersionInFile)
  if (typeof version !== 'string') {
    throw new Error(`Not found version in file '${pathToFile}' on '${pathToVersionInFile}'`)
  }
  if (!semver.valid(version)) {
    throw new Error(`Not found valid version in file '${pathToFile}' on '${pathToVersionInFile}' is '${version}'.`)
  }
  return { oldVersion: version, newVersion: undefined }
}
/**
 * Function writes specified version to file and returns old value in `oldVersionand new value in `newVersion`.
 * @param newVersion Version, that to be written to file.
 * @param pathToFile Path to file.
 * @param pathToVersionInFile Path to find version in file. Default value is `version`. (e.g. `ver`, `info.version`, `path.to.version`)
 * @param fileType File type. Default value is `json`.
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
  const oldVersion = extractDataFromObject(data, pathToVersionInFile)
  injectDataToObject(newVersion, data, pathToVersionInFile)
  await writeObjectToFile(pathToFile, data, fileType)
  return { oldVersion, newVersion }
}
/**
 * Function reads version from file and generates new version from it,
 * which is then written to file.
 * Function returns old version in `oldVersion` and new version in `newVersion`.
 * @param releaseType Release type that determines how version changes.
 * @param pathToFile Path to file.
 * @param pathToVersionInFile Path to find version in file. Default value is `version`. (e.g. `ver`, `info.version`, `path.to.version`)
 * @param identifier Identifier to use for prefix in pre-release version. Applies to `releaseType` with values `prerelease`, `premajor`, `preminor`,`prepath`.
 * @param fileType File type. Default value is `json`.
 */
export async function nextVersion({
  releaseType,
  pathToFile,
  pathToVersionInFile = 'version',
  fileType = 'json',
  identifier,
}: NextVersionConfig): Promise<VersionResult> {
  let data: any = await readObjectFromFile(pathToFile, fileType)
  const oldVersion = extractDataFromObject(data, pathToVersionInFile)
  if (typeof oldVersion !== 'string') {
    throw new Error(`Not found version in file '${pathToFile}' on '${pathToVersionInFile}'.`)
  }
  const newVersion = semver.inc(oldVersion, releaseType, undefined, identifier)
  if (typeof newVersion !== 'string') {
    throw new Error(`Not possible increase version from '${oldVersion}' with release type '${releaseType}'.`)
  }

  injectDataToObject(newVersion, data, pathToVersionInFile)
  await writeObjectToFile(pathToFile, data, fileType)
  return { oldVersion, newVersion }
}
