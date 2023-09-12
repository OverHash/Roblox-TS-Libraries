--!strict
local React = require(script.Parent.Parent.React)

export type FixTypeLater = any

export type EqualityFn<T> = (a: T, b: T) -> boolean

export type ExtendedEqualityFn<T, P> = (a: T, b: T, c: P, d: P) -> boolean

export type DispatchProp<A = any> = {
	dispatch: (any) -> (),
}
export type Matching<InjectedProps, DecorationTargetProps> = {
	[any]: any,
}

--[[
* a property P will be present if :
* - it is present in both DecorationTargetProps and InjectedProps
* - InjectedProps[P] can satisfy DecorationTargetProps[P]
* ie: decorated component can accept more types than decorator is injecting
*
* For decoration, inject props or ownProps are all optionally
* required by the decorated (right hand side) component.
* But any property required by the decorated component must be satisfied by the injected property.
]]
export type Shared<InjectedProps, DecorationTargetProps> = {
	[any]: any?,
}

export type ConnectedComponent<C, P> = React.FC<P> & {
	WrappedComponent: C,
}

--[[
* This interface allows you to easily create a hook that is properly typed for your
* store's root state.
*
* @example
*
* interface RootState {
*   property: string;
* }
*
* const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
]]
export type TypedUseSelectorHook<TState> = {
	<TSelected>(
		selector: (state: TState) -> TSelected,
		equalityFn: EqualityFn<any>?
	) -> TSelected
}

return {}
