# stl-parser

This is a simplified STL file parser.

Note: The development tool chain for this project is a little out of date, but functional. It was based off of https://github.com/jeremyckahn/node-cli-boilerplate.

## Getting started

Clone and install this repo:

```
git clone git@github.com:jeremyckahn/stl-parser.git
cd stl-parser
npm install
```

## Usage

You can provide any valid STL text file to this CLI tool, but you can easily test it out with the included `lib/fixtures/moon.stl` file:

```
$: npm run exec -- lib/fixtures/moon.stl
```

## Run the tests

```
npm test
```

## Design decisions

I decided to optimize for time complexity over space complexity, DRYness, or loose coupling. The process of reading and parsing STL data is an O(n) operation spread across two functions (`parseStl` and `parseSolid`). I chose a single-pass approach to reading and processing the data. This results in each line only ever being processed once aside from some initial data transformations to make it easier to work with.

## Areas for improvement

- I could have consolidated the `while` loops in `parseStl` and `parseSolid`, but that would result in a rather unwieldy monolith that would be a bit harder to test.
- Memory usage could be better. I preferred readability over memory optimization for this project. The result is suboptimal garbage creation.
- This code makes assumptions about the format of the input in the interest of performance (for example, that every `loop` has exactly three `vertex` lines). I'm not familiar enough the STL file format to know if this is brittle or not.
- The methods are idempotent, but tightly coupled. They make a lot of assumptions about how they will be used in the interest of performance. The API would have to be revisited for this to be a useful library.

## License

MIT.
