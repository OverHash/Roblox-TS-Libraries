local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")

local runCLI = require(ReplicatedStorage.DevPackages.Jest).runCLI

local processServiceExists, ProcessService = pcall(function()
	return game:GetService("ProcessService")
end)

local story = {
	summary = "Run Jest tests",
	controls = nil,
	render = function()
		task.spawn(function()
			local status, result = runCLI(ServerScriptService.abbreviate, {
				verbose = false,
				ci = false,
			}, { ServerScriptService.abbreviate }):awaitStatus()

			if status == "Rejected" then
				print(result)
			end

			if
				status == "Resolved"
				and result.results.numFailedTestSuites == 0
				and result.results.numFailedTests == 0
			then
				if processServiceExists then
					ProcessService:ExitAsync(0)
				end
			end

			if processServiceExists then
				ProcessService:ExitAsync(1)
			end
		end)

		return function() end
	end,
}

return story
