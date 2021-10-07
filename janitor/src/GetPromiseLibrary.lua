-- monkey patched by OverHash for roblox-ts support
-- roblox-ts exposes the TS runtime lib through _G[script]
-- which exposes the Promise library
local function GetPromiseLibrary()
	return true, _G[script.Parent].Promise
end

return GetPromiseLibrary
