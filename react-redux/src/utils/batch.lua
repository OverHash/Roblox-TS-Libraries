--!strict
local exports = {}

-- Default to a dummy "batch" implementation that just runs the callback
local function defaultNoopBatch(callback: () -> ())
	callback()
end

local batch = defaultNoopBatch

-- Allow injecting another batching function later
exports.setBatch = function(newBatch: typeof(defaultNoopBatch))
	batch = newBatch
end

-- Supply a getter just to skip dealing with ESM bindings
exports.getBatch = function()
	return batch
end

return exports
