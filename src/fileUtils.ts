import fs from 'fs'

export type FileType = 'json'

/**
 * Precte data ze souboru, ktere je mozne nasledne zpracovat zkrze Promise.
 * @param path Cesta k souboru.
 */
export function readFileAsync(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(new Error(`Unable read from file '${path}'.`))
      resolve(data)
    })
  })
}
/**
 * Ulozi data do souboru.
 * @param path Cesta k souboru.
 * @param data Data, ktera budou zapsana do souboru.
 */
export function writeFileAsync(path: string, data: any) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) reject(new Error(`Unable write to file '${path}'.`))
      resolve()
    })
  })
}

/**
 * Precte data z JSON souboru a pokusi se je prevest na JS objekt.
 * @param path Cesta k souboru.
 */
export async function readFromJsonFile(path: string): Promise<object> {
  const data = await readFileAsync(path)
  try {
    if (typeof data !== 'string') throw new Error()
    return JSON.parse(data)
  }
  catch {
    throw new Error(`Syntax error inside JSON file '${path}'.`)
  }
}
/**
 * Zapise JS objekt do JSON souboru.
 * @param path Cesta k souboru.
 * @param data JS objekt, ktery bude preveden na JSON a ulozen do souboru.
 */
export function writeToJsonFile(path: string, data: any) {
  return writeFileAsync(path, JSON.stringify(data, undefined, 2))
}

// =====================================================

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
