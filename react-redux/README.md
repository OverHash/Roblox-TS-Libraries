# [`@rbxts/react-redux`](https://www.npmjs.com/package/@rbxts/react-redux)

roblox-ts typings of [react-redux](https://github.com/chriscerie/react-redux) for Roblox.

## Installation

To use, [`@rbxts/react-ts`](https://www.npmjs.com/package/@rbxts/react-ts) must be installed first.

## Changes from Luau version and compatibility

A few minimal changes from the original source have been made to have better roblox-ts compatibility:

- `shallowEqual` internally uses [@rbxts/luau-polyfill-internal](https://www.npmjs.com/package/@rbxts/luau-polyfill-internal) rather than `Collections`
- References to `Redux` directly under `node_modules/@rbxts` folder in rojo sourcetree removed to avoid having to install a forked `@rbxts/rodux` to satisfy the rojo sourcetree requirement

## Sources

`react-redux` types were partially derived from [DefinitelyTyped/react-redux](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-redux) and [DefinitelyTyped/react](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react/v17), with some minor modifications being performed to have compatibility with `@rbxts/react-ts`. Some types (i.e., `Connect` and `batch`) are not exported as they are not present in the Luau [react-redux](https://github.com/chriscerie/react-redux) version.
