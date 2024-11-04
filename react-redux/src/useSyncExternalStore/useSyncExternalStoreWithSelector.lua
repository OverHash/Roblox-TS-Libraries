--!strict
-- Upstream: https://github.com/facebook/react/blob/0ae348018d5b3a3f1ccdd92de85d9cc581b2b98d/packages/use-sync-external-store/src/useSyncExternalStoreWithSelector.js

local React = require(script.Parent.Parent.Parent.react)
local Shared = require(script.Parent.Parent.Parent.ReactLua.node_modules[".luau-aliases"]["@jsdotlua"].shared)
local useSyncExternalStore = require(script.Parent.useSyncExternalStoreShimClient)

local is = Shared.objectIs

-- Same as useSyncExternalStore, but supports selector and isEqual arguments.
return function<Snapshot, Selection>(
	subscribe: (() -> ()) -> () -> (),
	getSnapshot: () -> Snapshot,
	getServerSnapshot: (() -> Snapshot)?,
	selector: (snapshot: Snapshot) -> Selection,
	isEqual: ((a: Selection, b: Selection) -> boolean)?
): Selection
	-- Use this to track the rendered snapshot.
	local instRef = React.useRef(nil :: {
		hasValue: true,
		value: Selection,
	} | {
		hasValue: false,
	} | nil)
	local inst: typeof(instRef.current)
	if not instRef.current then
		inst = {
			hasValue = false,
		}
		instRef.current = inst
	else
		inst = instRef.current
	end

	local getSelection = React.useMemo(function()
		-- Track the memoized state using closure variables that are local to this
		-- memoized instance of a getSnapshot function. Intentionally not using a
		-- useRef hook, because that state would be shared across all concurrent
		-- copies of the hook/component.
		local hasMemo = false
		local memoizedSnapshot
		local memoizedSelection: Selection
		local memoizedSelector = function(nextSnapshot: Snapshot)
			if not hasMemo then
				-- The first time the hook is called, there is no memoized result.
				hasMemo = true
				memoizedSnapshot = nextSnapshot
				local nextSelection = selector(nextSnapshot)
				if isEqual ~= nil then
					-- Even if the selector has changed, the currently rendered selection
					-- may be equal to the new selection. We should attempt to reuse the
					-- current value if possible, to preserve downstream memoizations.
					if inst and inst.hasValue then
						local currentSelection = inst.value
						if isEqual(currentSelection, nextSelection) then
							memoizedSelection = currentSelection
							return currentSelection
						end
					end
				end
				memoizedSelection = nextSelection
				return nextSelection
			end

			-- We may be able to reuse the previous invocation's result.
			local prevSnapshot: Snapshot = memoizedSnapshot
			local prevSelection: Selection = memoizedSelection

			if is(prevSnapshot, nextSnapshot) then
				-- The snapshot is the same as last time. Reuse the previous selection.
				return prevSelection
			end

			-- The snapshot has changed, so we need to compute a new selection.
			local nextSelection = selector(nextSnapshot)

			-- If a custom isEqual function is provided, use that to check if the data
			-- has changed. If it hasn't, return the previous selection. That signals
			-- to React that the selections are conceptually equal, and we can bail
			-- out of rendering.
			if isEqual ~= nil and isEqual(prevSelection, nextSelection) then
				return prevSelection
			end

			memoizedSnapshot = nextSnapshot
			memoizedSelection = nextSelection
			return nextSelection
		end
		local getSnapshotWithSelector = function()
			return memoizedSelector(getSnapshot())
		end
		return getSnapshotWithSelector
	end, { getSnapshot, getServerSnapshot, selector, isEqual } :: { any })

	local value = useSyncExternalStore(subscribe, getSelection)

	React.useEffect(function()
		inst = {
			hasValue = true,
			value = value,
		}
	end, { value })

	React.useDebugValue(value)
	return value
end
