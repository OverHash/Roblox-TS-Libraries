-- Janitor
-- Original by Validark
-- Modifications by pobammer
-- roblox-ts support by OverHash and Validark

local TS = _G[script]

local Promise = TS.Promise
local Scheduler = require(script.Scheduler)

local IndicesReference = newproxy(false)
local LinkToInstanceIndex = newproxy(true)
getmetatable(LinkToInstanceIndex).__tostring = function()
	return "LinkToInstanceIndex"
end

local Janitor = {
	__index = {
		CurrentlyCleaning = true;
		[IndicesReference] = nil;
	};
}

local FastSpawn = Scheduler.FastSpawn
local Wait = Scheduler.Wait

local TypeDefaults = {
	["function"] = true;
	RBXScriptConnection = "Disconnect";
}

--[[**
	Instantiates a new Janitor object.
	@returns [Janitor]
**--]]
function Janitor.new()
	return setmetatable({
		CurrentlyCleaning = false;
		[IndicesReference] = nil;
	}, Janitor)
end

--[[**
	Determines if the passed object is a Janitor.
	@param [any] Object The object you are checking.
	@returns [boolean] Whether or not the object is a Janitor.
**--]]
function Janitor.Is(Object)
	return type(Object) == "table" and getmetatable(Object) == Janitor
end

--[[**
	Adds an `Object` to Janitor for later cleanup, where `MethodName` is the key of the method within `Object` which should be called at cleanup time. If the `MethodName` is `true` the `Object` itself will be called instead. If passed an index it will occupy a namespace which can be `Remove()`d or overwritten. Returns the `Object`.
	@param [any] Object The object you want to clean up.
	@param [string | true?] MethodName The name of the method that will be used to clean up. If not passed, it will first check if the object's type exists in TypeDefaults, and if that doesn't exist, it assumes `Destroy`.
	@param [any?] Index The index that can be used to clean up the object manually.
	@returns [any] The object that was passed.
**--]]
function Janitor.__index:Add(Object, MethodName, Index)
	if Index then
		self:Remove(Index)

		local This = self[IndicesReference]
		if not This then
			This = {}
			self[IndicesReference] = This
		end

		This[Index] = Object
	end

	self[Object] = MethodName or TypeDefaults[typeof(Object)] or "Destroy"
	return Object
end

-- My version of Promise has PascalCase, but I converted it to use lowerCamelCase for this release since obviously that's important to do.

--[[**
	Adds a promise to the janitor. If the janitor is cleaned up and the promise is not completed, the promise will be cancelled.
	@param [Promise] PromiseObject The promise you want to add to the janitor.
	@returns [Promise]
**--]]
function Janitor.__index:AddPromise(PromiseObject)
	if PromiseObject:getStatus() == Promise.Status.Started then
		local Id = newproxy(false)
		local NewPromise = self:Add(Promise.resolve(PromiseObject), "cancel", Id)
		NewPromise:finallyCall(self.Remove, self, Id)
		return NewPromise
	else
		return PromiseObject
	end
end

--[[**
	Cleans up whatever `Object` was set to this namespace by the 3rd parameter of `:Add()`.
	@param [any] Index The index you want to remove.
	@returns [Janitor] The same janitor, for chaining reasons.
**--]]
function Janitor.__index:Remove(Index)
	local This = self[IndicesReference]

	if This then
		local Object = This[Index]

		if Object then
			local MethodName = self[Object]

			if MethodName then
				if MethodName == true then
					Object()
				else
					Object[MethodName](Object)
				end

				self[Object] = nil
			end

			This[Index] = nil
		end
	end

	return self
end

--[[**
	Gets whatever object is stored with the given index, if it exists. This was added since Maid allows getting the task using `__index`.
	@param [any] Index The index that the object is stored under.
	@returns [any?] This will return the object if it is found, but it won't return anything if it doesn't exist.
**--]]
function Janitor.__index:Get(Index)
	local This = self[IndicesReference]
	if This then
		return This[Index]
	end
end

--[[**
	Calls each Object's `MethodName` (or calls the Object if `MethodName == true`) and removes them from the Janitor. Also clears the namespace. This function is also called when you call a Janitor Object (so it can be used as a destructor callback).
	@returns [void]
**--]]
function Janitor.__index:Cleanup()
	if not self.CurrentlyCleaning then
		self.CurrentlyCleaning = nil
		for Object, MethodName in next, self do
			if Object == IndicesReference then
				continue
			end

			if MethodName == true then
				Object()
			else
				Object[MethodName](Object)
			end

			self[Object] = nil
		end

		local This = self[IndicesReference]
		if This then
			for Index in next, This do
				This[Index] = nil
			end

			self[IndicesReference] = {}
		end

		self.CurrentlyCleaning = false
	end
end

--[[**
	Calls `:Cleanup()` and renders the Janitor unusable.
	@returns [void]
**--]]
function Janitor.__index:Destroy()
	self:Cleanup()
	table.clear(self)
	setmetatable(self, nil)
end

Janitor.__call = Janitor.__index.Cleanup

--- Makes the Janitor clean up when the instance is destroyed
-- @param Instance Instance The Instance the Janitor will wait for to be Destroyed
-- @returns Disconnectable table to stop Janitor from being cleaned up upon Instance Destroy (automatically cleaned up by Janitor, btw)
-- @author Corecii
local Disconnect = {Connected = true}
Disconnect.__index = Disconnect
function Disconnect:Disconnect()
	self.Connected = false
	self.Connection:Disconnect()
end

--[[**
	"Links" this Janitor to an Instance, such that the Janitor will `Cleanup` when the Instance is `Destroyed()` and garbage collected. A Janitor may only be linked to one instance at a time, unless `AllowMultiple` is true. When called with a truthy `AllowMultiple` parameter, the Janitor will "link" the Instance without overwriting any previous links, and will also not be overwritable. When called with a falsy `AllowMultiple` parameter, the Janitor will overwrite the previous link which was also called with a falsy `AllowMultiple` parameter, if applicable.
	@param [Instance] Object The instance you want to link the Janitor to.
	@param [boolean?] AllowMultiple Whether or not to allow multiple links on the same Janitor.
	@returns [RbxScriptConnection] A pseudo RBXScriptConnection that can be disconnected.
**--]]
function Janitor.__index:LinkToInstance(Object, AllowMultiple)
	local Reference = Instance.new("ObjectValue")
	Reference.Value = Object

	local ManualDisconnect = setmetatable({}, Disconnect)
	local Connection
	local function ChangedFunction(Obj, Par)
		if not Reference.Value then
			ManualDisconnect.Connected = false
			return self:Cleanup()
		elseif Obj == Reference.Value and not Par then
			Obj = nil
			Wait(0.03)

			if (not Reference.Value or not Reference.Value.Parent) and ManualDisconnect.Connected then
				if not Connection.Connected then
					ManualDisconnect.Connected = false
					return self:Cleanup()
				else
					while true do
						Wait(0.2)
						if not ManualDisconnect.Connected then
							return
						elseif not Connection.Connected then
							ManualDisconnect.Connected = false
							return self:Cleanup()
						elseif Reference.Value.Parent then
							return
						end
					end
				end
			end
		end
	end

	Connection = Object.AncestryChanged:Connect(ChangedFunction)
	ManualDisconnect.Connection = Connection
	Object = nil
	FastSpawn(ChangedFunction, Reference.Value, Reference.Value.Parent)

	if AllowMultiple then
		self:Add(ManualDisconnect, "Disconnect")
	else
		self:Add(ManualDisconnect, "Disconnect", LinkToInstanceIndex)
	end

	return ManualDisconnect
end

--[[**
	Links several instances to a janitor, which is then returned.
	@param [...Instance] ... All the instances you want linked.
	@returns [Janitor] A janitor that can be used to manually disconnect all LinkToInstances.
**--]]
function Janitor.__index:LinkToInstances(...)
	local ManualCleanup = Janitor.new()
	for _, Object in ipairs({...}) do
		ManualCleanup:Add(self:LinkToInstance(Object, true), "Disconnect")
	end

	return ManualCleanup
end

return {
	Janitor = Janitor,
}