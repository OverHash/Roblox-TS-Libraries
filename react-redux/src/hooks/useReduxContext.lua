--!strict
local React = require(script.Parent.Parent.Parent.React)
local ReactReduxContext = require(script.Parent.Parent.components.Context)

local exports = {}

--[[
 * A hook to access the value of the `ReactReduxContext`. This is a low-level
 * hook that you should usually not need to call directly.
 *
 * @returns {any} the value of the `ReactReduxContext`
 *
 * @example
 *
 * import React from 'react'
 * import { useReduxContext } from 'react-redux'
 *
 * export const CounterComponent = () -> {
 *   const { store } = useReduxContext()
 *   return <div>{store.getState()}</div>
 * }
]]
exports.useReduxContext = function(): ReactReduxContext.ReactReduxContextValue?
	local contextValue = React.useContext(ReactReduxContext)

	--selene: allow(global_usage)
	if _G.__DEV__ and not contextValue then
		error("could not find react-redux context value; please ensure the component is wrapped in a <Provider>")
	end

	return contextValue
end

return exports
