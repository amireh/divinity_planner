# Divinity: Original Sin II .pak scraper

Extract game data from .pak archives.

## Usage

Use [ExportTool](http://larian.com/forums/ubbthreads.php?ubb=showflat&Number=57
2322&page=7) to extract the `Shared.pak` archive into `/archives/Shared`.

Run the CLI and take it from there:

    bin/dos2-pak --help

To (re)generate the database:

    bin/dos2-pak extract
    bin/dos2-pak refine

Make sure to manually go over the diffs of each file under `db/` and review
the changes. When you're ready to commit, generate them as `.json` and stage
them to `packages/dos2`:

    bin/dos2-pak generate --format json

## Refinement

### Tiers

    bin/dos2-pak query Tier --present --uniq | sort

### Abilities that have spaces in their name

    bin/dos2-pak list-properties | sort | cut -d':' -f1 | egrep "[ ]"

## TODO

- [ ] figure out where the icons are in the spritesheet
- [ ] scrape talents
- [ ] scrape statuses (potions / `Generated/Data/{StatusData,Potion}.txt`)