--!strict

-- OverHash deviation: local Redux = require(script.Parent.Parent.Parent.Redux)
local Batch = require(script.Parent.batch)

-- encapsulates the subscription logic for connecting a component to the redux store, as
-- well as nesting subscriptions of descendant components, so that we can ensure the
-- ancestor components re-render before descendants

local exports = {}

type VoidFunc = () -> ()

type Listener = {
	callback: VoidFunc,
	next: Listener?,
	prev: Listener?,
}

type ListenerCollection = {
	clear: () -> (),
	notify: () -> (),
	get: () -> { Listener },
	subscribe: (callback: VoidFunc) -> VoidFunc,
}

function createListenerCollection(): ListenerCollection
	local batch = Batch.getBatch()
	local first: Listener?
	local last: Listener?

	return {
		clear = function()
			first = nil
			last = nil
		end,

		notify = function()
			batch(function()
				local listener = first
				while listener do
					listener.callback()
					listener = listener.next
				end
			end)
		end,

		get = function()
			local listeners: { Listener } = {}
			local listener = first
			while listener do
				table.insert(listeners, listener)
				listener = listener.next
			end
			return listeners
		end,

		subscribe = function(callback: () -> ())
			local isSubscribed = true

			local listener: Listener = {
				callback = callback,
				prev = last,
			}
			last = listener

			if listener.prev then
				listener.prev.next = listener
			else
				first = listener
			end

			return function()
				if not isSubscribed or not first then
					return
				end
				isSubscribed = false

				if listener.next then
					listener.next.prev = listener.prev
				else
					last = listener.prev
				end
				if listener.prev then
					listener.prev.next = listener.next
				else
					first = listener.next
				end
			end
		end,
	}
end

export type Subscription = {
	addNestedSub: (listener: VoidFunc) -> VoidFunc,
	notifyNestedSubs: VoidFunc,
	handleChangeWrapper: VoidFunc,
	isSubscribed: () -> boolean,
	onStateChange: VoidFunc?,
	trySubscribe: VoidFunc,
	tryUnsubscribe: VoidFunc,
	getListeners: () -> ListenerCollection,
}

local nullListeners = table.freeze({
	notify = function() end,
	get = function()
		return {}
	end,
}) :: ListenerCollection

-- OverHash deviation:
exports.createSubscription = function(store: any, parentSub: Subscription?)
	-- instead of `exports.createSubscription = function(store: typeof(Redux.Store.new()), parentSub: Subscription?)`
	local unsubscribe: VoidFunc?
	local listeners: ListenerCollection = nullListeners

	local subscription: Subscription

	local function handleChangeWrapper()
		if subscription.onStateChange then
			subscription.onStateChange()
		end
	end

	local function trySubscribe()
		if not unsubscribe then
			if parentSub then
				unsubscribe = parentSub.addNestedSub(handleChangeWrapper)
			else
				-- DEVIATION: Roblox Rodux uses store.changed signal
				local changed = store.changed:connect(handleChangeWrapper)
				unsubscribe = function()
					changed:disconnect()
				end
			end

			listeners = createListenerCollection()
		end
	end

	local function addNestedSub(listener: () -> ())
		trySubscribe()
		return listeners.subscribe(listener)
	end

	local function notifyNestedSubs()
		listeners.notify()
	end

	local function isSubscribed()
		return unsubscribe ~= nil
	end

	local function tryUnsubscribe()
		if unsubscribe then
			unsubscribe()
			unsubscribe = nil
			listeners.clear()
			listeners = nullListeners
		end
	end

	subscription = {
		addNestedSub = addNestedSub,
		notifyNestedSubs = notifyNestedSubs,
		handleChangeWrapper = handleChangeWrapper,
		isSubscribed = isSubscribed,
		trySubscribe = trySubscribe,
		tryUnsubscribe = tryUnsubscribe,
		getListeners = function()
			return listeners
		end,
	}

	return subscription
end

return exports
