## Changelog

### Unreleased Changes

### 1.16.0-ts.0

- Updated to upstream `1.16.0` Janitor source
  - Added `Janitor.AddObject` for constructing an object.

### 1.15.7-ts.0

- Updated to upstream `1.15.7` Janitor source
  - Fixed an error when setting `SuppressInstanceReDestroy`
  - Safeguarded `LinkToInstances` from accepting non-instances at runtime
  - Support `instanceof` TS usage

### 1.15.4-ts.0

- Updated to upstream `1.15.4` Janitor source

- Added a toggle to avoid double destruction of instances.
- Fixed an error being thrown when an ended thread is cleaned up.

### 1.15.3-ts.0

- Updated to upstream `1.15.3` Janitor source
  - Adds `RemoveNoClean`, `RemoveListNoClean`, and `GetAll` methods

### 1.14.1-ts.0

- Fixed `Is` method type definition

### 1.14.1-ts.0

- Added a new `LinkToInstance` method which will instead use `Instance.Destroying`.
- Added traceback to `Janitor:AddPromise` for invalid promises.
- The legacy `LinkToInstance` method has been renamed to `LegacyLinkToInstance`.
- Fixed Janitor not warning about an invalid `MethodName` for threads and functions.
- Fixed incorrect documentation about `Janitor.CurrentlyCleaning`.

### 1.14.0-ts.1

- Fixed `RemoveList` definitions

### 1.14.0-ts.0

- You can now add a `thread` using `:Add`. This will cancel said thread when the Janitor is cleaned up.
- Added `__tostring` to the Janitor class.
- Added `:RemoveList` as an alternative to long `:Remove` chains.
- Added the properties of `Janitor` and `RbxScriptConnection` to the documentation.
- Recompiled with L+ C Edition.
- Put `RbxScriptConnection` in a separate file.
- Documentation now will split the code examples by language more obviously.

### 1.13.15-ts.0

- `Janitor.AddPromise` now will handle cancellations properly.
- `Janitor.Cleanup` now uses a while loop instead of a for loop when cleaning up to fix adding other janitors during cleanup.

### 1.13.12-ts.1

- Fixed Janitor loading bug

### 1.13.12-ts.0

- Removes the change from `1.13.6-ts.0` where cleanup tasks were no longer called synchronously.
  - Janitor now calls the cleanup tasks one-by-one, synchronously.

### 1.13.6-ts.0

- Added thread safety

### 1.13.5-ts.2

- Fixed `README.md` changelog.

### 1.13.5-ts.1

- Removed unused types.

### 1.13.5-ts.0

- Updated TS package to match Luau package ([release](https://github.com/howmanysmall/Janitor/releases/tag/1.13.5)).

### 1.1.3

- Fixed LinkToInstance for deferred Signal type. This does slightly worsen stack traces, but it shouldn't be as bad as it breaking.

### 1.1.2

- Fixed major bug where destroyed Janitors added to a Janitor do not clean up nicely. See [official release page](https://github.com/howmanysmall/Janitor/releases/tag/1.1.2) for example code.
- Reduced the size of Scheduler.
- Added `__tostring` to `IndicesReference`.
- Added safety check to `AddPromise`.
- Added `ClassName` to Janitor object.
- Changed version to match the official release.
- Fixed link to Janitor repository in README.md.

### 1.0.7

- Removed the usage of global state.
- Optimized the `LinkToInstances` function.

### 1.0.6

- Fixed the return type of `Janitor.Add` to return the object passed.
- Fixed `Janitor.Add` to accept `true` for `methodName` when passing a function

### 1.0.5

- Fixed the imports to `Scheduler` being the wrong path

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
