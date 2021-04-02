# @rbxts/profileservice

[![NPM](https://nodei.co/npm/@rbxts/profileservice.png)](https://npmjs.org/package/@rbxts/profileservice)

## Installation:
```npm i @rbxts/profileservice```

## Example Usage
See [MadStudioRoblox/ProfileService](https://github.com/MadStudioRoblox/ProfileService)

## Changelog
### Unreleased

### 1.3.0
- Added `ListenToHopReady`
- Updated to commit [96e10b3](https://github.com/MadStudioRoblox/ProfileService/commit/96e10b376663379001fc63f6793ddfc31a0f491d)

### 1.2.1
- Converted `Object` into `object` for the types.
### 1.2.0
- Update to commit [df74918](https://github.com/MadStudioRoblox/ProfileService/commit/df7491868929d456aa6e0a871b55e5b092ff8317)

### 1.1.2
- Made initial DataStore call wrapped in a coroutine to prevent errors in applications such as AeroGameFramework

### 1.1.1
- Fixed `ViewProfileAsync` returning incorrect datatype

### 1.1.0
- Update to commit [f5ef22b](https://github.com/MadStudioRoblox/ProfileService/commit/f5ef22b2e2d31c039f59656f38df60df7ad08eb2)

### 1.0.5
- Fixed IsActive not being a function (See [#4](https://github.com/OverHash/Roblox-TS-Libraries/pull/4))

### 1.0.4
- Updated README.md

### 1.0.3
- Fixed globals.d.ts not being included in the npm package

### 1.0.2
- Reworked export ordering so that you can import types such as `Profile` into your code.

### 1.0.0
- Published profileservice V1.0.0 (from GitHub commit [ac9be3f](https://github.com/MadStudioRoblox/ProfileService/commit/ac9be3f9ce20c0657aecf6cb498e245b66530dc0))