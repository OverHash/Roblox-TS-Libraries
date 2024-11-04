--!strict
local React = require(script.Parent.Parent.Parent.react)
--OverHash deviation: local Redux = require(script.Parent.Parent.Parent.Redux)
local Subscription = require(script.Parent.Parent.utils.Subscription)

export type ReactReduxContextValue<SS = any, A = any> = {
	store: any, --OverHash deviation: use any instead of typeof(Redux.Store.new()),
	subscription: Subscription.Subscription,
	getServerState: (() -> SS)?,
}

local ReactReduxContext = React.createContext(nil :: ReactReduxContextValue?)

export type ReactReduxContextInstance = typeof(ReactReduxContext)

--selene: allow(global_usage)
if _G.__DEV__ then
	ReactReduxContext.displayName = "ReactRedux"
end

return ReactReduxContext
