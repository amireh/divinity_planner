# divinity_planner

> UPDATE: the previous domain www.divinityplanner.cf no longer works, please 
> use the new one at www.divinityplanner.tk instead!

This is a character planner/builder web application for Divinity: Original Sin.
The application is available at ~~www.divinityplanner.cf~~ www.divinityplanner.tk.

## Features

- customize a full party of up to 4 characters:
  + set a character's level and see how it affects the amount of attribute and ability points that become available to them
  + distribute attribute and ability points
- explore the skills available in each ability and see what level is required for each tier of those skills _(very helpful for deciding which ability to unlock and in what order, instead of going through a swarm of wiki pages...)_
- build up a skill-book to get an idea of how your in-game arsenal would look like _(e.g. need more mitigation skills? more damage? etc.)_
- the tool will remember your choices in the URL so you can share/reload without worrying about losing your plan!

## Hacking

Clone the git repo and run `npm install` to get the packages. Once that is done, you can:

- run `npm run server` to launch the dev-server (with hot live-reload)
- run `npm run build` to build the app
- run `npm run test` to run the tests

We scrape the content from http://divinity.wikia.com. Currently, the descriptions of the skills are a mess and will probably come from a different source later.

## Credits

- http://divinity.wikia.com for all the content and images!
- http://divinityoriginalsin.wikia.com/ for the favicon

## License

MIT
