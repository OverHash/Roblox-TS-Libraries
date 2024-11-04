--!strict
local React = require(script.Parent.Parent.Parent.react)
-- OverHash deviation: local Redux = require(script.Parent.Parent.Parent.Redux)
local Context = require(script.Parent.Parent.components.Context)
local useDefaultReduxContext = require(script.Parent.useReduxContext).useReduxContext

local exports = {}

--[[
 * Hook factory, which creates a `useStore` hook bound to a given context.
 *
 * @param {React.Context} [context=ReactReduxContext] Context passed to your `<Provider>`.
 * @returns {Function} A `useStore` hook bound to the specified context.
]]
exports.createStoreHook = function<S, A>(context: React.Context<Context.ReactReduxContextValue<S, A>>?)
	context = context or Context.ReactReduxContext
	local useReduxContext: typeof(useDefaultReduxContext) = if context == Context.ReactReduxContext
		then useDefaultReduxContext
		else function()
			return React.useContext(context)
		end

	return function<State, Action>()
		local contextValue = useReduxContext()
		assert(contextValue, "Error occured trying to find redux context. This is likely a bug.")
		return contextValue.store :: any --OverHash deviation: use `any` instead of typeof(Redux.Store.new())
	end
end

--[[
 * A hook to access the redux store.
 *
 * @returns {any} the redux store
 *
 * @example
 *
 * import React from 'react'
 * import { useStore } from 'react-redux'
 *
 * export const ExampleComponent = () => {
 *   const store = useStore()
 *   return <div>{store.getState()}</div>
 * }
]]
exports.useStore = exports.createStoreHook()

return exports
