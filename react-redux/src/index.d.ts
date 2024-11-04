// Type definitions for react-redux 7.1
// Project: https://github.com/reduxjs/react-redux
// Definitions by: Qubo <https://github.com/tkqubo>
//                 Curits Layne <https://github.com/clayne11>
//                 Frank Tan <https://github.com/tansongyang>
//                 Nicholas Boll <https://github.com/nicholasboll>
//                 Dibyo Majumdar <https://github.com/mdibyo>
//                 Valentin Descamps <https://github.com/val1984>
//                 Johann Rakotoharisoa <https://github.com/jrakotoharisoa>
//                 Anatoli Papirovski <https://github.com/apapirovski>
//                 Boris Sergeyev <https://github.com/surgeboris>
//                 Søren Bruus Frank <https://github.com/soerenbf>
//                 Jonathan Ziller <https://github.com/mrwolfz>
//                 Dylan Vann <https://github.com/dylanvann>
//                 Yuki Ito <https://github.com/Lazyuki>
//                 Kazuma Ebina <https://github.com/kazuma1989>
//                 Michael Lebedev <https://github.com/megazazik>
//                 jun-sheaf <https://github.com/jun-sheaf>
//                 Lenz Weber <https://github.com/phryneas>
//                 Mark Erikson <https://github.com/markerikson>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

// OverHash deviation:
type JSXElementConstructor<P> =
    | ((props: P) => Element | null)
    | (new (props: P) => Component<any, any>);
type Key = string | number;
type Ref<T> = string | { bivarianceHack(instance: T | null): any }["bivarianceHack"];
interface Attributes {
	key?: Key;
}
interface ClassAttributes<T> extends Attributes {
	ref?: Ref<T>;
}
interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
	displayName?: string | undefined;
}
// end OverHash deviation

import {
    Component,
    ComponentClass,
    Context,
    Element,
	ExoticComponent
} from '@rbxts/react';

import {
    Action,
    AnyAction,
    Dispatch,
    Store
} from '@rbxts/redux';

/**
 * This interface can be augmented by users to add default types for the root state when
 * using `react-redux`.
 * Use module augmentation to append your own type definition in a your_custom_type.d.ts file.
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */
// tslint:disable-next-line:no-empty-interface
export interface DefaultRootState {}

export type AnyIfEmpty<T extends object> = keyof T extends never ? any : T;
export type RootStateOrAny = AnyIfEmpty<DefaultRootState>;

// Omit taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

export interface DispatchProp<A extends Action = AnyAction> {
    dispatch: Dispatch<A>;
}

/**
 * A property P will be present if:
 * - it is present in DecorationTargetProps
 *
 * Its value will be dependent on the following conditions
 * - if property P is present in InjectedProps and its definition extends the definition
 *   in DecorationTargetProps, then its definition will be that of DecorationTargetProps[P]
 * - if property P is not present in InjectedProps then its definition will be that of
 *   DecorationTargetProps[P]
 * - if property P is present in InjectedProps but does not extend the
 *   DecorationTargetProps[P] definition, its definition will be that of InjectedProps[P]
 */
export type Matching<InjectedProps, DecorationTargetProps> = {
    [P in keyof DecorationTargetProps]: P extends keyof InjectedProps
        ? InjectedProps[P] extends DecorationTargetProps[P]
            ? DecorationTargetProps[P]
            : InjectedProps[P]
        : DecorationTargetProps[P];
};

/**
 * a property P will be present if :
 * - it is present in both DecorationTargetProps and InjectedProps
 * - InjectedProps[P] can satisfy DecorationTargetProps[P]
 * ie: decorated component can accept more types than decorator is injecting
 *
 * For decoration, inject props or ownProps are all optionally
 * required by the decorated (right hand side) component.
 * But any property required by the decorated component must be satisfied by the injected property.
 */
export type Shared<
    InjectedProps,
    DecorationTargetProps
    > = {
        [P in Extract<keyof InjectedProps, keyof DecorationTargetProps>]?: InjectedProps[P] extends DecorationTargetProps[P] ? DecorationTargetProps[P] : never;
    };

// Infers prop type from component C
export type GetProps<C> = C extends JSXElementConstructor<infer P>
    ? C extends ComponentClass<P> ? ClassAttributes<InstanceType<C>> & P : P
    : never;

// Applies LibraryManagedAttributes (proper handling of defaultProps
// and propTypes).
export type GetLibraryManagedProps<C> = JSX.LibraryManagedAttributes<C, GetProps<C>>;

export type InferThunkActionCreatorType<TActionCreator extends (...args: any[]) => any> =
    TActionCreator extends (...args: infer TParams) => (...args: any[]) => infer TReturn
        ? (...args: TParams) => TReturn
        : TActionCreator;

export type HandleThunkActionCreator<TActionCreator> =
    TActionCreator extends (...args: any[]) => any
        ? InferThunkActionCreatorType<TActionCreator>
        : TActionCreator;

// redux-thunk middleware returns thunk's return value from dispatch call
// https://github.com/reduxjs/redux-thunk#composition
export type ResolveThunks<TDispatchProps> =
    TDispatchProps extends { [key: string]: any }
        ? {
            [C in keyof TDispatchProps]: HandleThunkActionCreator<TDispatchProps[C]>
        }
        : TDispatchProps;

// the conditional type is to support TypeScript 3.0, which does not support mapping over tuples and arrays;
// once the typings are updated to at least TypeScript 3.1, a simple mapped type can replace this mess
export type ResolveArrayThunks<TDispatchProps extends ReadonlyArray<any>> =
    TDispatchProps extends [infer A1, infer A2, infer A3, infer A4, infer A5, infer A6, infer A7, infer A8, infer A9]
    ? [HandleThunkActionCreator<A1>, HandleThunkActionCreator<A2>, HandleThunkActionCreator<A3>, HandleThunkActionCreator<A4>,
        HandleThunkActionCreator<A5>, HandleThunkActionCreator<A6>, HandleThunkActionCreator<A7>, HandleThunkActionCreator<A8>, HandleThunkActionCreator<A9>]
    : TDispatchProps extends [infer A1, infer A2, infer A3, infer A4, infer A5, infer A6, infer A7, infer A8]
    ? [HandleThunkActionCreator<A1>, HandleThunkActionCreator<A2>, HandleThunkActionCreator<A3>, HandleThunkActionCreator<A4>,
        HandleThunkActionCreator<A5>, HandleThunkActionCreator<A6>, HandleThunkActionCreator<A7>, HandleThunkActionCreator<A8>]
    : TDispatchProps extends [infer A1, infer A2, infer A3, infer A4, infer A5, infer A6, infer A7]
    ? [HandleThunkActionCreator<A1>, HandleThunkActionCreator<A2>, HandleThunkActionCreator<A3>, HandleThunkActionCreator<A4>,
        HandleThunkActionCreator<A5>, HandleThunkActionCreator<A6>, HandleThunkActionCreator<A7>]
    : TDispatchProps extends [infer A1, infer A2, infer A3, infer A4, infer A5, infer A6]
    ? [HandleThunkActionCreator<A1>, HandleThunkActionCreator<A2>, HandleThunkActionCreator<A3>, HandleThunkActionCreator<A4>, HandleThunkActionCreator<A5>, HandleThunkActionCreator<A6>]
    : TDispatchProps extends [infer A1, infer A2, infer A3, infer A4, infer A5]
    ? [HandleThunkActionCreator<A1>, HandleThunkActionCreator<A2>, HandleThunkActionCreator<A3>, HandleThunkActionCreator<A4>, HandleThunkActionCreator<A5>]
    : TDispatchProps extends [infer A1, infer A2, infer A3, infer A4] ? [HandleThunkActionCreator<A1>, HandleThunkActionCreator<A2>, HandleThunkActionCreator<A3>, HandleThunkActionCreator<A4>]
    : TDispatchProps extends [infer A1, infer A2, infer A3] ? [HandleThunkActionCreator<A1>, HandleThunkActionCreator<A2>, HandleThunkActionCreator<A3>]
    : TDispatchProps extends [infer A1, infer A2] ? [HandleThunkActionCreator<A1>, HandleThunkActionCreator<A2>]
    : TDispatchProps extends [infer A1] ? [HandleThunkActionCreator<A1>]
    : TDispatchProps extends Array<infer A> ? Array<HandleThunkActionCreator<A>>
    : TDispatchProps extends ReadonlyArray<infer A> ? ReadonlyArray<HandleThunkActionCreator<A>>
    : never
    ;

/**
 * Initializes a selector function (during each instance's constructor). That selector function is called any time the
 * connector component needs to compute new props, as a result of a store state change or receiving new props. The
 * result of <code>selector</code> is expected to be a plain object, which is passed as the props to the wrapped
 * component. If a consecutive call to <code>selector</code> returns the same object (<code>===</code>) as its previous
 * call, the component will not be re-rendered. It's the responsibility of <code>selector</code> to return that
 * previous object when appropriate.
 */
export type SelectorFactory<S, TProps, TOwnProps, TFactoryOptions> =
    (dispatch: Dispatch<Action>, factoryOptions: TFactoryOptions) => Selector<S, TProps, TOwnProps>;

export type Selector<S, TProps, TOwnProps = null> = TOwnProps extends null | undefined
    ? (state: S) => TProps
    : (state: S, ownProps: TOwnProps) => TProps;

export interface ReactReduxContextValue<SS = any, A extends Action = AnyAction> {
    store: Store<SS, A>;
    storeState: SS;
}

export interface ProviderProps<A extends Action = AnyAction> {
    /**
     * The single Redux store in your application.
     */
    store: Store<any, A>;
    /**
     * Optional context to be used internally in react-redux. Use React.createContext() to create a context to be used.
     * If this is used, generate own connect HOC by using connectAdvanced, supplying the same context provided to the
     * Provider. Initial value doesn't matter, as it is overwritten with the internal state of Provider.
     */
    context?: Context<ReactReduxContextValue> | undefined;
    children?: Element;
}

/**
 * Makes the Redux store available to the connect() calls in the component hierarchy below.
 */
export class Provider<A extends Action = AnyAction> extends Component<ProviderProps<A>> {
	public render(): Element | undefined;
}

/**
 * Exposes the internal context used in react-redux. It is generally advised to use the connect HOC to connect to the
 * redux store instead of this approach.
 */
export const ReactReduxContext: Context<ReactReduxContextValue>;

/* eslint-disable @definitelytyped/no-unnecessary-generics */

/**
 * Compares two arbitrary values for shallow equality. Object values are compared based on their keys, i.e. they must
 * have the same keys and for each key the value must be equal according to the `Object.is()` algorithm. Non-object
 * values are also compared with the same algorithm as `Object.is()`.
 */
export function shallowEqual<T>(left: T, right: any): boolean;

/**
 * A hook to access the redux `dispatch` function.
 *
 * Note for `redux-thunk` users: the return type of the returned `dispatch` functions for thunks is incorrect.
 * However, it is possible to get a correctly typed `dispatch` function by creating your own custom hook typed
 * from the store's dispatch function like this: `const useThunkDispatch = () => useDispatch<typeof store.dispatch>();`
 *
 * @returns redux store's `dispatch` function
 *
 * @example
 *
 * import React from '@rbxts/roact'
 * import { useDispatch } from '@rbxts/react-redux'
 *
 * export const CounterComponent = ({ value }) => {
 *   const dispatch = useDispatch()
 *   return (
 *     <div>
 *       <span>{value}</span>
 *       <button onClick={() => dispatch({ type: 'increase-counter' })}>
 *         Increase counter
 *       </button>
 *     </div>
 *   )
 * }
 */
// NOTE: the first overload below and note above can be removed if redux-thunk typings add an overload for
// the Dispatch function (see also this PR: https://github.com/reduxjs/redux-thunk/pull/247)
export function useDispatch<TDispatch = Dispatch<any>>(): TDispatch;
export function useDispatch<A extends Action = AnyAction>(): Dispatch<A>;

/**
 * A hook to access the redux store's state. This hook takes a selector function
 * as an argument. The selector is called with the store state.
 *
 * This hook takes an optional equality comparison function as the second parameter
 * that allows you to customize the way the selected state is compared to determine
 * whether the component needs to be re-rendered.
 *
 * If you do not want to have to specify the root state type for whenever you use
 * this hook with an inline selector you can use the `TypedUseSelectorHook` interface
 * to create a version of this hook that is properly typed for your root state.
 *
 * @param selector the selector function
 * @param equalityFn the function that will be used to determine equality
 *
 * @returns the selected state
 *
 * @example
 *
 * import React from '@rbxts/roact'
 * import { useSelector } from '@rbxts/react-redux'
 * import { RootState } from './store'
 *
 * export const CounterComponent = () => {
 *   const counter = useSelector((state: RootState) => state.counter)
 *   return <div>{counter}</div>
 * }
 */
export function useSelector<TState = DefaultRootState, TSelected = unknown>(
    selector: (state: TState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean
): TSelected;

/**
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
 */
export interface TypedUseSelectorHook<TState> {
    <TSelected>(
        selector: (state: TState) => TSelected,
        equalityFn?: (left: TSelected, right: TSelected) => boolean
    ): TSelected;
}

/**
 * A hook to access the redux store.
 *
 * @returns the redux store
 *
 * @example
 *
 * import React from '@rbxts/roact'
 * import { useStore } from '@rbxts/react-redux'
 *
 * export const ExampleComponent = () => {
 *   const store = useStore()
 *   return <div>{store.getState()}</div>
 * }
 */
export function useStore<S = RootStateOrAny, A extends Action = AnyAction>(): Store<S, A>;

/**
 * Hook factory, which creates a `useSelector` hook bound to a given context.
 *
 * @param Context passed to your `<Provider>`.
 * @returns A `useSelector` hook bound to the specified context.
 */
export function createSelectorHook<S = RootStateOrAny, A extends Action = AnyAction>(
    context?: Context<ReactReduxContextValue<S, A>>,
): <Selected extends unknown>(
    selector: (state: S) => Selected,
    equalityFn?: (previous: Selected, next: Selected) => boolean,
) => Selected;

/**
 * Hook factory, which creates a `useStore` hook bound to a given context.
 *
 * @param Context passed to your `<Provider>`.
 * @returns A `useStore` hook bound to the specified context.
 */
export function createStoreHook<S = RootStateOrAny, A extends Action = AnyAction>(
    context?: Context<ReactReduxContextValue<S, A>>,
): () => Store<S, A>;

/**
 * Hook factory, which creates a `useDispatch` hook bound to a given context.
 *
 * @param Context passed to your `<Provider>`.
 * @returns A `useDispatch` hook bound to the specified context.
 */
export function createDispatchHook<S = RootStateOrAny, A extends Action = AnyAction>(
    context?: Context<ReactReduxContextValue<S, A>>,
): () => Dispatch<A>;

/* eslint-enable @definitelytyped/no-unnecessary-generics */
