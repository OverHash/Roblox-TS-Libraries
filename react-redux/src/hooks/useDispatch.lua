--!strict

local React = require(script.Parent.Parent.Parent.react)
local ReactReduxContext = require(script.Parent.Parent.components.Context)
local useDefaultStore = require(script.Parent.useStore).useStore
local createStoreHook = require(script.Parent.useStore).createStoreHook

local exports = {}

--[[
 * Hook factory, which creates a `useDispatch` hook bound to a given context.
 *
 * @param {React.Context} [context=ReactReduxContext] Context passed to your `<Provider>`.
 * @returns {Function} A `useDispatch` hook bound to the specified context.
 ]]
exports.createDispatchHook = function<S, A>(context: React.Context<ReactReduxContext.ReactReduxContextValue<S, A>>?)
	context = context or ReactReduxContext
	local useStore = if context == ReactReduxContext then useDefaultStore else createStoreHook(context)

	return function()
		local store = useStore()
		return function(action: { [string]: any })
			return store:dispatch(action)
		end
	end
end

--[[
 * A hook to access the redux `dispatch` function.
 *
 * @returns {any|function} redux store's `dispatch` function
 *
 * @example
 *
 * import React, { useCallback } from 'react'
 * import { useDispatch } from 'react-redux'
 *
 * export const CounterComponent = ({ value }) => {
 *   const dispatch = useDispatch()
 *   const increaseCounter = useCallback(() => dispatch({ type: 'increase-counter' }), [])
 *   return (
 *     <div>
 *       <span>{value}</span>
 *       <button onClick={increaseCounter}>Increase counter</button>
 *     </div>
 *   )
 * }
]]
exports.useDispatch = exports.createDispatchHook()

return exports
