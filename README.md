# Versioner
CLI nástroj pro usnadnění práce při měnění verze v konfiguračních souborech v projektech. Vhodné pro projekty, kde je verze uložena na více místech.
 
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
	-  Možné úrovně: *major, minor, patch*
		- `-n path`: *1.2.3* => *1.2.4*
		- `-n minor`: *1.2.3* => *1.3.0*
		- `-n major`: *1.2.3* => *2.0.0*
- **-t, --tag**
	- Změní cestu, kde je hledána verze v souboru.
	- Pokud není použit přepínač, tak výchozí cesta je *version*. 
		- ` `: `{ "version": "1.2.3", ... }`
	- Pomocí teček je možné zanořovat se hlouběji do struktury souboru.
		- `-t ver`: `{ "ver": "1.2.3", ... }`
		- `-t conf.env.version`: `{ "conf": { "env": { "version": "1.2.3", ... }, ... }, ... }`
- **--preid** 
	- Označení použité pro předběžné verze 
		- např. `prerelease`, `prepatch`, `preminor`, `premajor`
- **-f, --file-format**
    - Určení jakého typu/formátu jsou soubory.
    - Podporované hodnoty: `json`
- **-v, --version**
	- Vypíše verzi používaného nástroje ***versioner***.
- **-h, --help**
	- Vypíše nápovědu k nástroji ***versioner***.

---------

## Použití knihovny
### Typescript
```typescript
import { readVersion, writeVersion, nextVersion, ReleaseType } from 'versioner-tool'
// nebo
import * as versioner from 'versioner-tool'
```
### Javascript
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
readVersion(pathToFile: string, pathToVersionInFile: string, fileType: string = 'json'): Promise<string>
```
- Precte verzi ulozenou v souboru a vrati ji.
- `pathToFile`: Cesta k souboru.
- `pathToVersionInFIle`: Cesta pro nalezeni verze v souboru. (pr. `ver`, `info.version`, `path.to.version`)
- `fileType`: Typ souboru (napr. json).
```ts
writeVersion(pathToFile: string, pathToVersionInFile: string, newVersion: string, fileType: string = 'json'): Promise<{ oldVersion: string | undefined, newVersion: string }>
```
- Zapise verzi do souboru a vrati starou a novou verzi.
- `pathToFile`: Cesta k souboru.
- `pathToVersionInFile`: Cesta pro nalezeni mista v souboru, kam bude zapsana verze. (pr. `ver`, `info.version`, `path.to.version`)
- `newVersion`: Verze, ktera bude zapsana do souboru.
- `fileType`: Typ souboru (napr. json).
```ts
nextVersion(pathToFile: string, pathToVersionInFile: string, releaseType: ReleaseType, identifier?: string, fileType: string = 'json'): Promise<{ oldVersion: string, newVersion: string }>
```
- Precte puvodni verzi ze souboru ze ktere vygeneruje novou verzi, kterou zapise do souboru.
- `pathToFile`: Cesta k souboru.
- `pathToVersionInFile`: Cesta pro naleyeni mista s verzi souboru, ktera bude zmenena. (pr. `ver`, `info.version`, `path.to.version`)
- `releaseType`: Typ vydani urcujici, jak se verze zmeni (patch, minor, major, prerelease, pre...).
- `identifier`: Identifikator pro typy vydani obsahujici prefix 'pre' (prereleace, prepatch, preminor, premajor).
- `fileType`: Typ souboru (napr. json).

---------------