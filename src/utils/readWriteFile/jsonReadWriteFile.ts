import { readFileAsync, writeFileAsync } from './promisfyReadWriteFile'

/**
 * Function read data from JSON file and will try convert readed data to JS object.
 * @param path Path to file.
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
 * Function convert JS object to data that will be written to JSON file.
 * @param path Path to file.
 * @param data JS object that will be converted to JSON and written to file.
 */
export function writeToJsonFile(path: string, data: any) {
  return writeFileAsync(path, JSON.stringify(data, undefined, 2))
}


