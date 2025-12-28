# Contributing

[Jest](https://jsdotlua.github.io/jest-lua) tests are written and are ran with [UI Labs](https://github.com/PepeElToro41/ui-labs/).

To run the tests:

1. Install dependencies via `wally install`. If this is your first time, you may also want to use [wally-package-types](github.com/JohnnyMorganz/wally-package-types)
2. Serve on a new baseplate with [rojo](https://github.com/rojo-rbx/rojo) via `rojo serve tests.project.json`
3. Connect in a new Studio
4. Open the UI Labs plugin and open the "runTests" story. It will execute all the tests defined in [src/tests.spec.luau](src/tests.spec.luau)
