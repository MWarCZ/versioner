import { readFromJsonFile, writeToJsonFile } from './jsonReadWriteFile'

// export type FileType = 'json' | 'yaml'
export type FileType = 'json'

/**
 * Pokusi se precist soubor a obsah prevest na JS objekt.
 * @param pathToFile Cesta k souboru.
 * @param fileType Typ souboru ze ktereho ma byt objekt nacten (napr. json).
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
 * Pokusi se zapsat JS objekt do souboru.
 * @param pathToFile Cesta k souboru.
 * @param dataObject JS objekt, ktery bude zapsan do souboru.
 * @param fileType Typ souboru ze ktereho ma byt objekt nacten (napr. json).
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
