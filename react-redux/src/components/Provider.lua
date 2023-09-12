--!strict

local React = require(script.Parent.Parent.Parent.React)
local ReactReduxContext = require(script.Parent.Context)
local Subscription = require(script.Parent.Parent.utils.Subscription)
-- OverHash deviation: local Redux = require(script.Parent.Parent.Parent.Redux)

export type ProviderProps<A = any, S = unknown> = {
	-- The single Redux store in your application.
	store: any, --OverHash deviation: use `any` instead of typeof(Redux.Store.new()),

	--[[
    * Optional context to be used internally in react-redux. Use React.createContext() to create a context to be used.
    * If this is used, you'll need to customize `connect` by supplying the same context provided to the Provider.
    * Initial value doesn't matter, as it is overwritten with the internal state of Provider.
    ]]
	context: React.Context<ReactReduxContext.ReactReduxContextValue<S, A>>?,
	children: React.ReactNode,
}

local function Provider<A, S>(props: ProviderProps<A, S>)
	local store = props.store
	local context = props.context
	local children = props.children

	local contextValue = React.useMemo(function()
		local subscription = Subscription.createSubscription(props.store)
		return {
			store = props.store,
			subscription = subscription,
		}
	end, { store })

	local previousState = React.useMemo(function()
		return store:getState()
	end, { store })

	React.useLayoutEffect(function()
		local subscription = contextValue.subscription
		subscription.onStateChange = subscription.notifyNestedSubs
		subscription.trySubscribe()

		if previousState ~= store:getState() then
			subscription.notifyNestedSubs()
		end
		return function()
			subscription.tryUnsubscribe()
			subscription.onStateChange = nil
		end
	end, { contextValue, previousState })

	local Context = context or ReactReduxContext

	return React.createElement(Context.Provider, {
		value = contextValue,
	}, children)
end

return Provider
