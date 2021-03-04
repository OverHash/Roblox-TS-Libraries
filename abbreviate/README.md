# @rbxts/abbreviate

[![NPM](https://nodei.co/npm/@rbxts/abbreviate.png)](https://npmjs.org/package/@rbxts/abbreviate)

## Installation:
```npm i @rbxts/abbreviate```

## Example Usage
```typescript
import createAbbreviator from "@rbxts/abbreviate";

const abbreviator = createAbbreviator();
abbreviator.setSetting('suffixTable', ['k', 'm', 'b']);
abbreviator.setSetting('decimalPlaces', 2);

print(abbreviator.stringToNumber('500')) // 500
print(abbreviator.stringToNumber('5k')) // 5000
print(abbreviator.stringToNumber('5m')) // 5000000
print(abbreviator.stringToNumber('1.23456m')) // 1234560

print(abbreviator.numberToString(999)) // 999
print(abbreviator.numberToString(1000)) // 1.00k
print(abbreviator.numberToString(1000000)) // 1.00m
print(abbreviator.numberToString(1234567)) // 1.23m
```

## Settings
The possible settings you can set are the following:
| Setting Name | Setting Value Type | Setting Description | Setting Default | Setting Example
|---|---|---|---|---|
| suffixTable | Array\<string\> | Sets the suffix table to be used when using `numberToString` | [here](https://github.com/OverHash/Roblox-TS-Libraries/blob/master/abbreviate/init.lua#L1-L52) 	| <pre lang="ts">["k", "m", "b"] |
| decimalPlaces | number | Sets the amount of decimal places a number may have when using `numberToString` | 2 | 4 |
| removeDanglingZeroes | boolean | Removes any extra zeroes after a decimal place that are dangling after `numberToString` calls. E.g. `"52506.004"` => `"5.2506k"`

## Why make me call the function?
You may want multiple abbreviators throughout your game with different settings, i.e. one module may want only 2 d.p. while another may want 0 d.p
To solve this, abbreviate requires you to construct a new "app"
These settings are independent of other "apps"

## Changelog

### 2.7.3
- Updated `README.md` to use `createAbbreviator()`

### 2.7.2
- Refactored internal code to use less memory

### 2.7.1
- Fixed a case where numbers under 1000 would have their decimal places stripped (e.g. `1.05` would become `1`, `0.5` would become `0`)
- Added unit tests
- Made function calls safer (it now validates the type of the data you pass)

### 2.7.0
- Changed the method used in `numberToString` to be similar to [Zombie Strike's](https://github.com/Kampfkarren/zombie-strike/blob/master/src/shared/ReplicatedStorage/Core/EnglishNumbers.lua) for more accurate rounding.

### 2.6.3
- Fixed numbers under 1000 not being added to the return result in `numbersToSortedString`.

### 2.6.2
- Removed prints in `numbersToSortedString`.

### 2.6.1
- Updated README.md.

### 2.6.0
- Created `numbersToSortedString`.

### 2.5.0
- Fixed a bug with `commify` function erroring.

### 2.4.0
- Added `commify(num: number): string` to convert a string into a comma separated value.

### 2.3.4
- Fixed `stringToNumber` returning `void` instead of `number`.
### 2.3.3
- Fixed numbers under 1000 not being decimal placed correctly when numberToString is called.

## Credits
[Kampfkarren](http://github.com/Kampfkarren/) - `numberToString` method
[Corecii](https://github.com/Corecii) - Help with `numbersToSortedString`
