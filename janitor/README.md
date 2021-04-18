# @rbxts/janitor

[![NPM](https://nodei.co/npm/@rbxts/janitor.png)](https://npmjs.org/package/@rbxts/janitor)

Typings for pobammer's forked [janitor module](https://github.com/howmanysmall/Janitor)

Credits to Validark for the original module, see [RoStrap's Janitor docs](https://rostrap.github.io/Libraries/Events/Janitor/) for more information.

## Changes
- Gets the Promise lib by using _G
- Returns
```lua
return {
	Janitor = Janitor
}
```
instead of just returning the `Janitor` namespace.

## Example Usage
```typescript
import { Janitor } from "@rbxts/janitor";

const Obliterator = new Janitor<{ Instances: Instance }>();

print(Obliterator.Add(new Instance("Part")));

// Queue the Part to be Destroyed at Cleanup time
Obliterator.Add(new Instance("Part"), "Destroy");

// Queue function to be called with `true` MethodName
Obliterator.Add(print, true);

// By passing an Index, the Object will occupy a namespace
// If "Instances" already exists, it will call :Remove("Instances") before writing
Obliterator.Add(new Instance("Part"), "Destroy", "Instances");

// Queue a promise to be cancelled when the Janitor is cleaned
// `result` is of type Promise<number>
const result = Obliterator.AddPromise(
	new Promise<number>((resolve, reject) => {
		wait(5);
		resolve(42);
	}),
);

// Cleanup all connections, calling `print`, Destroying our Part, and cancelling our promise
Obliterator.Cleanup();
```

## Changelog
### Unreleased Changes
- Fixed link to Janitor repository in README.md

### 1.1.2
- Fixed major bug where destroyed Janitors added to a Janitor do not clean up nicely. See [official release page](https://github.com/howmanysmall/Janitor/releases/tag/1.1.2) for example code.
- Reduced the size of Scheduler.
- Added `__tostring` to `IndicesReference`.
- Added safety check to `AddPromise`.
- Added `ClassName` to Janitor object.
- Changed version to match the official release.
- Fixed link to Janitor repository in README.md

### 1.0.7
- Removed the usage of global state.
- Optimized the `LinkToInstances` function.

### 1.0.6
- Fixed the return type of `Janitor.Add` to return the object passed.
- Fixed `Janitor.Add` to accept `true` for `methodName` when passing a function

### 1.0.5
- Fixed the imports to `Scheduler` being the wrong path

### 1.0.3
- Fixed `README.md` example
- Changed `package.json` keywords

### 1.0.2
- Simplified `Add` types
- Credited Validark

### 1.0.1
- Fixed `README.md`

### 1.0.0
- Initial release

## Installation:
```npm i @rbxts/janitor```