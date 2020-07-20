# @rbxts/module3d

[![NPM](https://nodei.co/npm/@rbxts/module3d.png)](https://npmjs.org/package/@rbxts/module3d)

## Installation:
```npm i @rbxts/module3d```

## Example Usage
```typescript
import * as module3d from "@rbxts/rotatedregion3";

const myRegion = new RotatedRegion3(new CFrame(10, 0, 5), new Vector3(5, 10, 5));
const parts = myRegion.FindPartsInRegion3();

parts.forEach(part => {
	print(`${part.Name} was inside the region!`)
});
```

## Changelog
### Unreleased

### 1.0.7
- Fixed imports not working correct, see [#1](https://github.com/OverHash/Roblox-TS-Libraries/issues/1)
