# @rbxts/abbreviate

[![NPM](https://nodei.co/npm/@rbxts/abbreviate.png)](https://npmjs.org/package/@rbxts/abbreviate)

## Installation:

`npm i @rbxts/abbreviate`

## Example Usage

```typescript
import Abbreviator from "@rbxts/abbreviate";

const abbreviator = new Abbreviator();
abbreviator.setSetting("suffixTable", ["k", "m", "b"]);
abbreviator.setSetting("decimalPlaces", 2);

print(abbreviator.stringToNumber("500")); // 500
print(abbreviator.stringToNumber("5k")); // 5000
print(abbreviator.stringToNumber("5m")); // 5000000
print(abbreviator.stringToNumber("1.23456m")); // 1234560

print(abbreviator.numberToString(999)); // 999
print(abbreviator.numberToString(1000)); // 1.00k
print(abbreviator.numberToString(1000000)); // 1.00m
print(abbreviator.numberToString(1234567)); // 1.23m
```

## Settings

The possible settings you can set are the following:
| Setting Name | Setting Value Type | Setting Description | Setting Default | Setting Example
|---|---|---|---|---|
| suffixTable | Array\<string\> | Sets the suffix table to be used when using `numberToString` | [here](https://github.com/OverHash/Roblox-TS-Libraries/blob/master/abbreviate/init.lua#L1-L52) | <pre lang="ts">["k", "m", "b"] |
| decimalPlaces | number | Sets the amount of decimal places a number may have when using `numberToString` | 2 | 4 |
| stripTrailingZeroes | boolean | Removes any extra zeroes after a decimal place that are dangling after `numberToString` calls. E.g. `"52506.004"` => `"5.2506k"` | false | `true`

## Why make `Abbreviator` a class?

You may want multiple abbreviators throughout your game with different settings, i.e. one module may want only 2 d.p. while another may want 0 d.p
To solve this, abbreviate requires you to construct a new abbreviator.
The settings of this abbreviator is independent of other abbreviators.

## Changelog

See [CHANGELOG.md](https://github.com/OverHash/Roblox-TS-Libraries/blob/master/abbreviate/CHANGELOG.md)

## Contributing

See [CONTRIBUTING.md](https://github.com/OverHash/Roblox-TS-Libraries/blob/master/abbreviate/CONTRIBUTING.md)

## Credits

- [Kampfkarren](http://github.com/Kampfkarren/) - `numberToString` method
- [Corecii](https://github.com/Corecii) - Help with `numbersToSortedString`
- [Scyfren](https://github.com/Scyfren) - Help with `stripTrailingZeroes`
