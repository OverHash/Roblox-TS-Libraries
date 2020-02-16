# @rbxts/tableutil

[![NPM](https://nodei.co/npm/@rbxts/tableutil.png)](https://npmjs.org/package/@rbxts/tableutil)

A simple table utility for [roblox-ts](https://github.com/roblox-ts/roblox-ts)

Updated since [this commit](https://github.com/Sleitnick/AeroGameFramework/blob/master/src/ReplicatedStorage/Aero/Shared/TableUtil.lua)

## Changes
- All methods do not mutate objects
	- This means that methods such as `tableutil.Print` will not modify the original table, but rather return a new table.
- FastRemove, FastRemoveFirstValue, Map, Filter, Reduce, IndexOf, Reverse have been removed, as you should be using Array methods.
- Assign has been removed, as you should be using Object methods.
- EncodeJSON/DecodeJSON has been removed, it's better practice to use the HttpService methods.

## Installation:
```npm i @rbxts/tableutil```

## Example Usage
```typescript
import tableutil from "@rbxts/tableutil";

// print a table
tableutil.Print(table, "Table Util Test", true); // recursive print `table` with title "Table Util Test"
```