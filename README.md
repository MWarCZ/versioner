> Language: [EN](README.md), [CZ](README.cz.md)

# Versioner

CLI tool and library to make it easier to change versions in project configuration files. Suitable for projects where version is stored in multiple locations.

---------
## Install
- **NPM**
  - Global
    - `npm install --global versioner-tool`
  - Local
    - `npm install --save-dev versioner-tool`
    - `npm install -D versioner-tool`
- **YARN**
  - Global
	- `yarn global add versioner-tool`
  - Local
    - `yarn add --dev versioner-tool`
    - `yarn add -D versioner-tool`

## Usage CLI
```bash
versioner <file.json ...> [-s | --set <version>] [-t | --tag <path.to.version>] [-f | --file-format <format>] 
versioner <file.json ...> [-n | --next <level>] [--preid <preid>] [-t | --tag <path.to.version>] [-f | --file-format <format>]
versioner [-v | --version]
versioner [-h | --help]
```
### Options
- **-s, --set** 
	- Set specific version in given file(s).
	- Version must be in format `Major.Minor.Patch`. 
- **-n, --next**
	- Increases version in file according to specified level.
	- Possible levels: `major`, `minor`, `patch`, `prerelease`, `premajor`, `preminor`, `prepatch`.
		- `-n path`: *1.2.3* => *1.2.4*
		- `-n minor`: *1.2.3* => *1.3.0*
		- `-n major`: *1.2.3* => *2.0.0*
- **-t, --tag**
	- Changes path to find version in file.
	- If not used, the default path is *version*.
		- ` `: `{ "version": "1.2.3", ... }`
	- Steps in path are separated by dots.
		- `-t ver`: `{ "ver": "1.2.3", ... }`
		- `-t conf.env.version`: `{ "conf": { "env": { "version": "1.2.3", ... }, ... }, ... }`
- **--preid** 
	- Identifier to use for prefix in pre-release version.
		- e.g. `prerelease`, `prepatch`, `preminor`, `premajor`
- **-f, --file-format**
    - Specify file type/format.
    - Supported values: `json`
- **-v, --version**
	- Print version of this tool.
- **-h, --help**
	- Print help.

-----------

## Usage library
- **Typescript**
```typescript
import { readVersion, writeVersion, nextVersion, ReleaseType } from 'versioner-tool'
// or
import * as versioner from 'versioner-tool'
```
- **Javascript**
```javascript
const readVersion = require('versioner-tool').readVersion
const writeVersion = require('versioner-tool').writeVersion
const nextVersion = require('versioner-tool').nextVersion
// or
const { readVersion, writeVersion, nextVersion } = require('versioner-tool')
// or
const versioner = require('versioner-tool')
```

### Documentation

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
- Function reads version saved in file and returns it in `oldVersion`.
- `pathToFile`: Path to file.
- `pathToVersionInFIle`: Path to find version in file.
	- Default value is `version`.
	- e.g. `ver`, `info.version`, `path.to.version`
- `fileType`: File type.
	- Supported types: `json` (In the future `yaml` too.)
	- Default value is `json`. 

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
- Function writes specified version to file and returns old value in `oldVersion` and new value in `newVersion`.
- `newVersion`: Version, that to be written to file.
- `pathToFile`: Path to file.
- `pathToVersionInFIle`: Path to find version in file.
	- Default value is `version`.
	- e.g. `ver`, `info.version`, `path.to.version`
- `fileType`: File type.
	- Supported types: `json` (In the future `yaml` too.)
	- Default value is `json`. 

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
- Function reads version from file and generates new version from it, which is then written to file. Function returns old version in `oldVersion` and new version in `newVersion`.
- `releaseType`: Release type that determines how version changes.
	- Supported values: `major`, `minor`, `path`, `prerelease`, `premajor`, `preminor`, `prepath`.
- `pathToFile`: Path to file.
- `pathToVersionInFIle`: Path to find version in file.
	- Default value is `version`.
	- e.g. `ver`, `info.version`, `path.to.version`
- `fileType`: File type.
	- Supported types: `json` (In the future `yaml` too.)
	- Default value is `json`. 
- `identifier`: Identifier to use for prefix in pre-release version.
	- Applies to `releaseType` with values `prerelease`, `premajor`, `preminor`, `prepath`.

--------------