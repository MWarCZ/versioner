import fs from 'fs'

/**
 * Read data from file. (Used Promise)
 * @param path Path to file.
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
 * Write data to file. (Used Promise)
 * @param path Path to file.
 * @param data Data which will be written to file.
 */
export function writeFileAsync(path: string, data: any) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) reject(new Error(`Unable write to file '${path}'.`))
      resolve()
    })
  })
}


