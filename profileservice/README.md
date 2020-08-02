# @rbxts/profileservice

[![NPM](https://nodei.co/npm/@rbxts/profileservice.png)](https://npmjs.org/package/@rbxts/profileservice)

## Installation:
```npm i @rbxts/profileservice```

## Example Usage
```typescript
import ProfileService from "@rbxts/profileservice";

const ProfileTemplate = {
	Cash: 0,
	Items: [],
	LogInTimes: 0,
} as const;

const GameProfileStore = ProfileStore.GetProfileStore("PlayerData", ProfileTemplate);

const profiles = new Map<Player, profile>();
```

## Changelog
### Unreleased

### 1.0.0
- Published profileservice V1.0.0 (from GitHub commit [ac9be3f](https://github.com/MadStudioRoblox/ProfileService/commit/ac9be3f9ce20c0657aecf6cb498e245b66530dc0))