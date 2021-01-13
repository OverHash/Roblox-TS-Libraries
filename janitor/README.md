# @rbxts/janitor

[![NPM](https://nodei.co/npm/@rbxts/janitor.png)](https://npmjs.org/package/@rbxts/janitor)

Typings for pobammer's forked [janitor module](https://gist.github.com/howmanysmall/55a2ea914ad0ecfa4c74028931f77825#file-janitorwithpromisesupport-lua)

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
import janitor from "@rbxts/tableutil";

const Obliterator = new Janitor();

// Queue the Part to be Destroyed at Cleanup time
Obliterator.Add(new Instance("Part"), "Destroy");

// Queue function to be called with `true` MethodName
Obliterator.Add(print, true);

// By passing an Index, the Object will occupy a namespace
// If "Instances" already exists, it will call :Remove("Instances") before writing
Obliterator.Add(new Instance("Part"), "Destroy", "Instances");
```

## Changelog

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