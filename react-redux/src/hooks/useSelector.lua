--!strict
local React = require(script.Parent.Parent.Parent.React)

local useDefaultReduxContext = require(script.Parent.useReduxContext).useReduxContext
local ReactReduxContext = require(script.Parent.Parent.components.Context)
local types = require(script.Parent.Parent.types)
local useSyncExternalStore = require(script.Parent.Parent.utils.useSyncExternalStore)

local notInitialized = useSyncExternalStore.notInitialized
type uSESWS = useSyncExternalStore.uSESWS

local exports = {}

-- Luau doens't think notInitialized can be casted into uSESWS
local useSyncExternalStoreWithSelectorUntyped: any = notInitialized
local useSyncExternalStoreWithSelector: uSESWS = useSyncExternalStoreWithSelectorUntyped
exports.initializeUseSelector = function(fn: uSESWS)
	useSyncExternalStoreWithSelector = fn
end

local refEquality: types.EqualityFn<any> = function(a, b)
	return a == b
end

--[[
 * Hook factory, which creates a `useSelector` hook bound to a given context.
 *
 * @param {React.Context} [context=ReactReduxContext] Context passed to your `<Provider>`.
 * @returns {Function} A `useSelector` hook bound to the specified context.
]]
exports.createSelectorHook = function(context: ReactReduxContext.ReactReduxContextInstance?): <TState, Selected>(
	selector: (state: TState) -> Selected,
	equalityFn: types.EqualityFn<Selected>?
) -> Selected
	context = context or ReactReduxContext
	local useReduxContext: typeof(useDefaultReduxContext) = if context == ReactReduxContext
		then useDefaultReduxContext
		else function()
			return React.useContext(context)
		end

	return function<TState, Selected>(selector: (state: TState) -> Selected, equalityFn: types.EqualityFn<any>?): Selected
		equalityFn = equalityFn or refEquality

		--selene: allow(global_usage)
		if _G.__DEV__ then
			if not selector then
				error(`You must pass a selector to useSelector`)
			end
			if typeof(selector) ~= "function" then
				error(`You must pass a function as a selector to useSelector`)
			end
			if typeof(equalityFn) ~= "function" then
				error(`You must pass a function as an equality function to useSelector`)
			end
		end

		local reduxContext = useReduxContext()
		assert(reduxContext, "Error occured trying to find redux context. This is likely a bug.")

		local store = reduxContext.store
		local subscription = reduxContext.subscription
		local getServerState = reduxContext.getServerState

		local getState = React.useCallback(function()
			return store:getState()
		end, { store })

		local selectedState = useSyncExternalStoreWithSelector(
			subscription.addNestedSub,
			getState,
			getServerState or getState,
			selector,
			equalityFn
		)

		React.useDebugValue(selectedState)

		return selectedState
	end
end

--[[
 * A hook to access the redux store's state. This hook takes a selector function
 * as an argument. The selector is called with the store state.
 *
 * This hook takes an optional equality comparison function as the second parameter
 * that allows you to customize the way the selected state is compared to determine
 * whether the component needs to be re-rendered.
 *
 * @param {Function} selector the selector function
 * @param {Function=} equalityFn the function that will be used to determine equality
 *
 * @returns {any} the selected state
 *
 * @example
 *
 * import React from 'react'
 * import { useSelector } from 'react-redux'
 *
 * export const CounterComponent = () -> {
 *   const counter = useSelector(state -> state.counter)
 *   return <div>{counter}</div>
 * }
 ]]
exports.useSelector = exports.createSelectorHook()

return exports
