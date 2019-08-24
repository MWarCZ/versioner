// Project: versioner
// File: src/fileUtils.ts
import fs from 'fs'

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
export function readFromJsonFile(path: string): Promise<object> {
  return readFileAsync(path).then(data => {
    try {
      if (typeof data !== 'string') throw new Error()
      return JSON.parse(data)
    } catch {
      throw new Error(`Syntax error inside JSON file '${path}'.`)
    }
  })
}
/**
 * Zapise JS objekt do JSON souboru.
 * @param path Cesta k souboru.
 * @param data JS objekt, ktery bude preveden na JSON a ulozen do souboru.
 */
export function writeToJsonFile(path: string, data: any) {
  return writeFileAsync(path, JSON.stringify(data))
}
