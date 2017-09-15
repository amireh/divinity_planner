# Divinity: Original Sin II .pak scraper

Extract game data from .pak archives.

## Usage

Use lslib.exe to extract the `Shared.pak` archive into
`/assets/unpacked/Shared`.

Run the CLI and take it from there:

    bin/dos2-pak-scraper --help

## Data

### Tiers

    bin/dos2-pak-scraper query Tier --present --uniq | sort

## TODO

- [ ] figure out where the icons are in the spritesheet