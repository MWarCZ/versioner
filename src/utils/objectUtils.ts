
/**
 * Finds and returns value in a given object by path, if any.
 * @param objectWithData JS object in which value should be searched.
 * @param pathToDataInObject Path to find places with value in JS object..
 */
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
 * Function try insert a new value into given JS object on given path.
 * @param newData New value to be inserted into object.
 * @param objectWithData JS object into which value will be inserted.
 * @param pathToDataInObject Path to find places for insert value into JS object.
 */
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
          // Last step => Insert new data here
          tmp[step] = newData
        } else if (typeof tmp[step] === 'undefined') {
          // Pokud neexistuje nic, tak vytvor.
          // If unexist must be create.
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


