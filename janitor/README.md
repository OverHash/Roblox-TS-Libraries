# @rbxts/janitor

[![NPM](https://nodei.co/npm/@rbxts/janitor.png)](https://npmjs.org/package/@rbxts/janitor)

Typings for howmanysmall's forked [janitor module](https://github.com/howmanysmall/Janitor)

View the [Janitor docs](https://howmanysmall.github.io/Janitor/)!

Credits to Validark for the original module, see [RoStrap's Janitor docs](https://rostrap.github.io/Libraries/Events/Janitor/) for more information.

## Installation:

`npm i @rbxts/janitor`

## Changes

- Gets the Promise lib by using `_G` rather than using wally package-esque import
- Returns

  ```lua
  return table.freeze({
  	Janitor = Janitor
  })
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
  new Promise<number>((resolve, _reject) => {
    task.wait(5);
    resolve(42);
  })
);

// Cleanup all connections, calling `print`, Destroying our Part, and cancelling our promise
Obliterator.Cleanup();
```

## Changelog

See [`CHANGELOG.md`](https://github.com/OverHash/Roblox-TS-Libraries/blob/master/janitor/CHANGELOG.md)
