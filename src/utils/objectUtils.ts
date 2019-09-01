
/**
 * Najde a vrati hodnotu v danem objektu dle cesty pokud existuje.
 * @param objectWithData JS objekt ve kterem ma byt hledana hodnota.
 * @param pathToDataInObject Cesta pro nalezeni mista s hodnotou v JS objektu.
 */
// export function getDataFromDataObject(
export function extractDataFromObject(
  objectWithData: any,
  pathToDataInObject: string,
): any {
  const stepsToDataInFile: string[] = pathToDataInObject.split('.')
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
 * @param pathToDataInObject Cesta pro nalezeni mista pro vlozeni hodnoty v JS objektu.
 */
// export function setDataToDataObject(
export function injectDataToObject(
  newData: any,
  objectWithData: any,
  pathToDataInObject: string,
  ): any {
  const stepsToDataInFile: string[] = pathToDataInObject.split('.')
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


