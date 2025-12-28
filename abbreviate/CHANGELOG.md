## Changelog

### 3.0.3
- Fixed `stripTrailingZeroes` incorrectly showing as `removeDanglingZeroes` in `README.md`

### 3.0.2
- Added setting default and setting example for `stripTrailingZeroes`

### 3.0.1
- Fixed `README.md` example being outdated
- Added `Scyfren` to contributors

### 3.0.0
- Changed the method to create an abbreviator from `createAbbreviator()` to `abbreviator.new()` (`new Abbreviator()` in TypeScript)
- Added option `stripTrailingZeroes`
- Fixed some bugs regarding settings changes
- Slight speed improvements

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
