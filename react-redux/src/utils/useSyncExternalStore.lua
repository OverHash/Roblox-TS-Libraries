local _useSyncExternalStore = require(script.Parent.Parent.useSyncExternalStore.useSyncExternalStoreShimClient)
local _useSyncExternalStoreWithSelector =
	require(script.Parent.Parent.useSyncExternalStore.useSyncExternalStoreWithSelector)

local exports = {}

exports.notInitialized = function()
	error("uSES not initialized!")
end

export type uSES = typeof(_useSyncExternalStore)
export type uSESWS = typeof(_useSyncExternalStoreWithSelector)

return exports
