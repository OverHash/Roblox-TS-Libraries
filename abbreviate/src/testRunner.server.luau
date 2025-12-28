local ServerScriptService = game:GetService("ServerScriptService")

local testEz = require(ServerScriptService.testEz)

testEz.TestBootstrap:run({ ServerScriptService.abbreviate:Clone() }, testEz.Reporters.TextReports)
