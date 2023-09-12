--!strict
-- Upstream: https://github.com/reduxjs/react-redux/blob/89a86805f2fcf9e8fbd2d1dae345ec791de4a71f/src/index.ts

local Provider = require(script.components.Provider)
--local connect = require(script.components.connect)

local ReactReduxContext = require(script.components.Context)

local useDispatch = require(script.hooks.useDispatch)
local useSelector = require(script.hooks.useSelector)
local useStore = require(script.hooks.useStore)

local Subscription = require(script.utils.Subscription)

--local types = require(script.types)

--local useSyncExternalStore = require(script.useSyncExternalStore.useSyncExternalStoreShimClient)
local useSyncExternalStoreWithSelector = require(script.useSyncExternalStore.useSyncExternalStoreWithSelector)

local batch = require(script.utils["reactBatchedUpdates.roblox"])
local setBatch = require(script.utils.batch).setBatch

local initializeUseSelector = useSelector.initializeUseSelector

initializeUseSelector(useSyncExternalStoreWithSelector)
--initializeConnect(useSyncExternalStore)

setBatch(batch)

export type Subscription = Subscription.Subscription

local exports = {
	Provider = Provider,
	ReactReduxContext = ReactReduxContext,
	--connect,
	useDispatch = useDispatch.useDispatch,
	createDispatchHook = useDispatch.createDispatchHook,
	useSelector = useSelector.useSelector,
	createSelectorHook = useSelector.createSelectorHook,
	useStore = useStore.useStore,
	createStoreHook = useStore.createStoreHook,
	shallowEqual = require(script.utils.shallowEqual),
}

return exports
