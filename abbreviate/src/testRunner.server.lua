local ServerScriptService = game:GetService("ServerScriptService")

local testEz = require(ServerScriptService.testEz)

testEz.TestBootstrap:run(
	{ ServerScriptService.abbreviate },
	testEz.Reporters.TextReports
)
