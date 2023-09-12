--!strict
-- Upstream: https://github.com/facebook/react/blob/0ae348018d5b3a3f1ccdd92de85d9cc581b2b98d/packages/use-sync-external-store/src/useSyncExternalStoreShimClient.js
--[[
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
]]

local React = require(script.Parent.Parent.Parent.React)
local Shared = require(script.Parent.Parent.Parent.Shared)

local is = Shared.objectIs

local didWarnUncachedGetSnapshot = false

local function checkIfSnapshotChanged<T>(inst: {
	value: T,
	getSnapshot: () -> T,
}): boolean
	local latestGetSnapshot = inst.getSnapshot
	local prevValue = inst.value
	local success, res = pcall(function()
		local nextValue = latestGetSnapshot()
		return not is(prevValue, nextValue)
	end)

	if success then
		return res
	end
	return true
end

-- Disclaimer: This shim breaks many of the rules of React, and only works
-- because of a very particular set of implementation details and assumptions
-- -- change any one of them and it will break. The most important assumption
-- is that updates are always synchronous, because concurrent rendering is
-- only available in versions of React that also have a built-in
-- useSyncExternalStore API. And we only use this shim when the built-in API
-- does not exist.
--
-- Do not assume that the clever hacks used by this hook also work in general.
-- The point of this shim is to replace the need for hacks by other libraries.
local useSyncExternalStore = function<T>(subscribe: (() -> ()) -> () -> (), getSnapshot: () -> T): T
	-- Read the current snapshot from the store on every render. Again, this
	-- breaks the rules of React, and only works here because of specific
	-- implementation details, most importantly that updates are
	-- always synchronous.
	local value = getSnapshot()
	--selene: allow(global_usage)
	if _G.__DEV__ then
		if not didWarnUncachedGetSnapshot then
			local cachedValue = getSnapshot()
			if not is(value, cachedValue) then
				didWarnUncachedGetSnapshot = true
				error("The result of getSnapshot should be cached to a() an infinite loop")
			end
		end
	end

	-- Because updates are synchronous, we don't queue them. Instead we force a
	-- re-render whenever the subscribed state changes by updating an some
	-- arbitrary useState hook. Then, during render, we call getSnapshot to read
	-- the current value.
	--
	-- Because we don't actually use the state returned by the useState hook, we
	-- can save a bit of memory by storing other stuff in that slot.
	--
	-- To implement the early bailout, we need to track some things on a mutable
	-- object. Usually, we would put that in a useRef hook, but we can stash it in
	-- our useState hook instead.
	--
	-- To force a re-render, we call forceUpdate({inst}). That works because the
	-- new object always fails an equality check.
	local state, forceUpdate = React.useState({
		inst = {
			value = value,
			getSnapshot = getSnapshot,
		},
	})
	local inst = state.inst

	-- Track the latest getSnapshot function with a ref. This needs to be updated
	-- in the layout phase so we can access it during the tearing check that
	-- happens on subscribe.
	React.useLayoutEffect(function()
		inst.value = value
		inst.getSnapshot = getSnapshot

		-- Whenever getSnapshot or subscribe changes, we need to check in the
		-- commit phase if there was an interleaved mutation. In concurrent mode
		-- this can happen all the time, but even in synchronous mode, an earlier
		-- effect may have mutated the store.
		if checkIfSnapshotChanged(inst) then
			-- Force a re-render.
			forceUpdate({ inst = inst })
		end
	end, { subscribe, value, getSnapshot } :: { any })

	React.useEffect(function()
		-- Check for changes right before subscribing. Subsequent changes will be
		-- detected in the subscription handler.
		if checkIfSnapshotChanged(inst) then
			-- Force a re-render.
			forceUpdate({ inst = inst })
		end
		local handleStoreChange = function()
			-- REACT TODO: Because there is no cross-renderer API for batching updates, it's
			-- up to the consumer of this library to wrap their subscription event
			-- with unstable_batchedUpdates. Should we try to detect when this isn't
			-- the case and print a warning in development?

			-- The store changed. Check if the snapshot changed since the last time we
			-- read from the store.
			if checkIfSnapshotChanged(inst) then
				-- Force a re-render.
				forceUpdate({ inst = inst })
			end
		end
		-- Subscribe to the store and return a clean-up function.
		return subscribe(handleStoreChange)
	end, { subscribe })

	React.useDebugValue(value)
	return value
end

return useSyncExternalStore
