# Divinity: Original Sin II .pak scraper

Extract game data from .pak archives.

## Usage

Use [ExportTool](http://larian.com/forums/ubbthreads.php?ubb=showflat&Number=57
2322&page=7) to extract the `Shared.pak` archive into `/archives/Shared`.

Run the CLI and take it from there:

    bin/dos2-pak-scraper --help

## Data

### Tiers

    bin/dos2-pak-scraper query Tier --present --uniq | sort

## TODO

- [ ] figure out where the icons are in the spritesheet
- [ ] scrape talents