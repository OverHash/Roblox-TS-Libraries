# @rbxts/abbreviate

[![NPM](https://nodei.co/npm/@rbxts/abbreviate.png)](https://npmjs.org/package/@rbxts/abbreviate)

## Installation:
```npm i @rbxts/abbreviate```

## Example Usage
```typescript
import abbreviate from "@rbxts/abbreviate";

const abbreviator = abbreviate();
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

## Why make me call the function?
You may want multiple abbreviators throughout your game with different settings, i.e. one module may want only 2 d.p. while another may want 0 d.p
To solve this, abbreviate requires you to construct a new "app"
These settings are independent of other "apps"