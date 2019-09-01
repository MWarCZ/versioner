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


