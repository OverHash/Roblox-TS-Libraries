--!strict

-- OverHash deviation: use "LuauPolyfill" instead of "Collections"
local Collections = require(script.Parent.Parent.Parent.ReactLua.node_modules[".luau-aliases"]["@jsdotlua"].collections)

local Object = Collections.Object

local function shallowEqual(objA: any, objB: any)
	if objA == objB then
		return true
	end

	if typeof(objA) ~= "table" or not objA or typeof(objB) ~= "table" or not objB then
		return false
	end

	local keysA = Object.keys(objA)
	local keysB = Object.keys(objB)

	if #keysA ~= #keysB then
		return false
	end

	for keyA, valueA in objA do
		if not objB[keyA] or valueA ~= objB[keyA] then
			return false
		end
	end

	return true
end

return shallowEqual
