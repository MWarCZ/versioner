# Versioner
CLI nástroj pro usnadnění práce při měnění verze v konfiguračních souborech v projektech. Vhodné pro projekty, kde je verze uložena na více místech.
 
------------

## Použití
```bash
versioner <file.json ...> [-s | --set <version>] [-t | --tag <path.to.version>]
versioner <file.json ...> [-n | --next <level>] [--preid <preid>] [-t | --tag <path.to.version>]
versioner [--version | -v]
versioner [--help | -h]
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
- **-v, --version**
	- Vypíše verzi používaného nástroje ***versioner***.
- **-h, --help**
	- Vypíše nápovědu k nástroji ***versioner***.

---------------