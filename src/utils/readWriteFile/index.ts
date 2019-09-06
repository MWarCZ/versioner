import { readFromJsonFile, writeToJsonFile } from './jsonReadWriteFile'

// export type FileType = 'json' | 'yaml'
export type FileType = 'json'

/**
 * Function will try to read file and convert readed data to JS object.
 * @param pathToFile Path to file.
 * @param fileType File type. Default value is `json`.
 */
export async function readObjectFromFile(pathToFile: string, fileType: FileType = 'json') {
  if (fileType === 'json') {
    try {
      let data = await readFromJsonFile(pathToFile)
      return data
    } catch (err) {
      throw new Error(`Unable read from file '${pathToFile}'.`)
    }
  } else {
    throw new Error(`Unknown file type '${fileType}'.`)
  }
}
/**
 * Function will try to write JS object to file.
 * @param pathToFile Path to file.
 * @param dataObject JS object which will be written to file.
 * @param fileType File type. Default value is `json`.
 */
export async function writeObjectToFile(pathToFile: string, dataObject: any, fileType: FileType = 'json') {
  if (fileType === 'json') {
    try {
      await writeToJsonFile(pathToFile, dataObject)
    } catch (err) {
      throw new Error(`Unable write to file '${pathToFile}'.`)
    }
  } else {
    throw new Error(`Unknown file type '${fileType}'.`)
  }
}
