# @rbxts/tableutil

[![NPM](https://nodei.co/npm/@rbxts/tableutil.png)](https://npmjs.org/package/@rbxts/tableutil)

A simple table utility for [roblox-ts](https://github.com/roblox-ts/roblox-ts)

Updated since [this release](https://github.com/Sleitnick/Knit/releases/tag/v0.0.18-alpha)

## Changes

**API REMOVALS:**

- `FastRemove`, `FastRemoveFirstValue`, `Map`, `Filter`, `Reduce`, `Find`, `Every`, `Some` have been removed, as you should be using Array methods.
- `Assign` has been removed as there is native TypeScript support for it (`{...a, ...b, ...c}`)
- `Extend` has been removed, as there is native TypeScript support for it (`[...a, ...b]`)
- `FlatMap` has been removed, as you can simply use `[...a.map(mapFunction)`]
- `Keys` has been removed, as there is alternative packages that achieve this (see [@rbxts/object-util](https://www.npmjs.com/package/@rbxts/object-utils))
- `EncodeJSON`/`DecodeJSON` has been removed, it's better practice to use the HttpService methods.

## Changelog

### 2.0.0

- Updated to [Knit v0.0.18-alpha](https://github.com/Sleitnick/Knit/releases/tag/v0.0.18-alpha)
  - This removes certain APIs such as `Print` and `IndexOf`
  - This implements new APIs such as `Reverse`
- Renamed the exported namespace to `TableUtil` (previously `tableutil`)

### 1.3.2

- Converted `Object` into `object` for the types.

### 1.3.1

- Fixed TableUtil.Sync incorrectly returning the original array in typings ([#5](https://github.com/OverHash/Roblox-TS-Libraries/issues/5))

## Installation:

`npm i @rbxts/tableutil`

## Example Usage

```typescript
import tableutil from "@rbxts/tableutil";

// print a table
tableutil.Print(table, "Table Util Test", true); // recursive print `table` with title "Table Util Test"
```
