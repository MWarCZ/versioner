> Jazyk: [EN](README.md), [CZ](README.cz.md)

# Versioner 

CLI nástroj a knihovna pro usnadnění práce při měnění verze v konfiguračních souborech v projektech. Vhodné pro projekty, kde je verze uložena na více místech.
 
------------
## Instalace
- **NPM**
  - Globální
    - `npm install --global versioner-tool`
  - Lokální
    - `npm install --save-dev versioner-tool`
    - `npm install -D versioner-tool`
- **YARN**
  - Globální
	- `yarn global add versioner-tool`
  - Lokální
    - `yarn add --dev versioner-tool`
    - `yarn add -D versioner-tool`

--------

## Použití CLI
```bash
versioner <file.json ...> [-s | --set <version>] [-t | --tag <path.to.version>] [-f | --file-format <format>] 
versioner <file.json ...> [-n | --next <level>] [--preid <preid>] [-t | --tag <path.to.version>] [-f | --file-format <format>]
versioner [-v | --version]
versioner [-h | --help]
```
### Přepínače
- **-s, --set** 
	- Nastaveni konkrétní verze v daném souboru/souborech.
	- Verze musí být ve formátu `Major.Minor.Patch`
- **-n, --next**
	-  Zvýší verzi v souboru dle zadané úrovně.
	-  Možné úrovně: `major`, `minor`, `patch`, `prerelease`, `premajor`, `preminor`, `prepatch`.
		- `-n path`: *1.2.3* => *1.2.4*
		- `-n minor`: *1.2.3* => *1.3.0*
		- `-n major`: *1.2.3* => *2.0.0*
- **-t, --tag**
	- Změní cestu k nalezení verze v souboru.
	- Pokud není použito, tak výchozí cesta je *version*. 
		- ` `: `{ "version": "1.2.3", ... }`
	- Kroky v cestě jsou doděleny tečkami.
		- `-t ver`: `{ "ver": "1.2.3", ... }`
		- `-t conf.env.version`: `{ "conf": { "env": { "version": "1.2.3", ... }, ... }, ... }`
- **--preid** 
	- Identifikátor, který se použije k předponě v předběžné verzi. 
		- např. `prerelease`, `prepatch`, `preminor`, `premajor`
- **-f, --file-format**
    - Určení typu/formátu souboru.
    - Podporované hodnoty: `json`
- **-v, --version**
	- Vytiskne verzi tohoto nástroje.
- **-h, --help**
	- Vypíše nápovědu.

---------

## Použití knihovny
- **Typescript**
```typescript
import { readVersion, writeVersion, nextVersion, ReleaseType } from 'versioner-tool'
// nebo
import * as versioner from 'versioner-tool'
```
- **Javascript**
```javascript
const readVersion = require('versioner-tool').readVersion
const writeVersion = require('versioner-tool').writeVersion
const nextVersion = require('versioner-tool').nextVersion
// nebo
const { readVersion, writeVersion, nextVersion } = require('versioner-tool')
// nebo
const versioner = require('versioner-tool')
```

### Dokumentace
```ts
readVersion(config: {
	pathToFile: string, 
	pathToVersionInFile?: string, 
	fileType?: FileType, 
}): Promise<{
  oldVersion: string | undefined,
  newVersion: string | undefined,
}>
```
- Funkce načte verzi uloženou v souboru a vráti ji v `oldVersion`.
- `pathToFile`: Cesta k souboru.
- `pathToVersionInFIle`: Cesta k nalezení verze v souboru.
	- Výchozí hodnota je `version`.
	- např. `ver`, `info.version`, `path.to.version`
- `fileType`: Typ souboru.
	- Podporované typy: `json` (V budoucnu i `yaml`.) 
	- Výchozí hodnota je `json`. 

```ts
writeVersion(config: {
  newVersion: string,
  pathToFile: string,
  pathToVersionInFile?: string,
  fileType?: FileType,
}): Promise<{
  oldVersion: string | undefined,
  newVersion: string | undefined,
}>
```
- Funkce zapíše zadanou verzi do souboru a vráti starou hodnotu v `oldVersion` a novou hodnotu v `newVersion`.
- `newVersion`: Verze, která bude zapsána do souboru.
- `pathToFile`: Cesta k souboru.
- `pathToVersionInFIle`: Cesta k nalezení verze v souboru.
	- Výchozí hodnota je `version`.
	- např. `ver`, `info.version`, `path.to.version`
- `fileType`: Typ souboru.
	- Podporované typy: `json` (V budoucnu i `yaml`.) 
	- Výchozí hodnota je `json`. 

```ts
nextVersion(config: {
  releaseType: ReleaseType,
  pathToFile: string,
  pathToVersionInFile?: string,
  fileType?: FileType,
  identifier?: string,
}): Promise<{
  oldVersion: string | undefined,
  newVersion: string | undefined,
}>
```
- Funkce přečte verzi ze souboru a z ní vygeneruje novou verzi, kterou poté zapíse do souboru. Funkce vraci starou verzi v `oldVersion` a novou verzi v `newVersion`.
- `releaseType`: Typ vydání, který určuje, jak se verze změní.
	- Podporované hodnoty: `major`, `minor`, `path`, `prerelease`, `premajor`, `preminor`, `prepath`.
- `pathToFile`: Cesta k souboru.
- `pathToVersionInFIle`: Cesta k nalezení verze v souboru.
	- Výchozí hodnota je `version`.
	- např. `ver`, `info.version`, `path.to.version`
- `fileType`: Typ souboru.
	- Podporované typy: `json` (V budoucnu i `yaml`.) 
	- Výchozí hodnota je `json`. 
- `identifier`: Identifikátor, který se použije k předponě v předběžné verzi.
	- Platí pro `releaseType` s hodnotami `prerelease`, `premajor`, `preminor`, `prepath`.

---------------