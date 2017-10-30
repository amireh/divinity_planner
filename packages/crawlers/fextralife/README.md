This is a crawler for http://divinityoriginalsin.wiki.fextralife.com which contains data for the Enhanced Edition version of the game.

Usage:

`./runner.js --help`

## Notes

This wiki is really anti-crawling; every request seems to go through at least 3 servers and each stamps a "test" cookie. The only way that seemed to work is through using `wget` with a set of cookies (using the `--load-cookies` option). The problem is _generating_ this list of cookies...

You have to use Firefox with the Export Cookies[1] extension, then visit the wiki page in your browser, export the cookies to a file and run `./runner.js crawl --cookies=path/to/cookies.txt`.

I know ._.

At the moment this crawler was written, there was no alternative to this wiki that contained EE stuff so :shrug: