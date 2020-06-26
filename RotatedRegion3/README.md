# @rbxts/rotatedregion3

[![NPM](https://nodei.co/npm/@rbxts/rotatedregion3.png)](https://npmjs.org/package/@rbxts/rotatedregion3)

## Installation:
```npm i @rbxts/rotatedregion3```

## Example Usage
```typescript
import * as RotatedRegion3 from "@rbxts/rotatedregion3";

const myRegion = new RotatedRegion3(new CFrame(10, 0, 5), new Vector3(5, 10, 5));
const parts = myRegion.FindPartsInRegion3();

parts.forEach(part => {
	print(`${part.Name} was inside the region!`)
});
```

## Changelog
### Unreleased

### 1.0.7
- Fixed imports not working correct, see [https://github.com/OverHash/Roblox-TS-Libraries/issues/1](1)
