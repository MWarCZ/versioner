import { readFileAsync, writeFileAsync } from './promisfyReadWriteFile'

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


