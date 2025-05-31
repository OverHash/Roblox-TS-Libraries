type Constructable<T> = new (...args: Parameters<T>) => T;

/**
 * A class to manage the connections in your game
 */
export class Janitor<U extends object | void = void> {
	/**
	 * Whether or not the Janitor is currently cleaning up.
	 */
	public readonly CurrentlyCleaning: boolean;

	/**
	 * Whether or not you want to suppress the re-destroying of instances.
	 * Default is `false`, which is the original behavior.
	 */
	public SuppressInstanceReDestroy: boolean;

	/**
	 * Whether or not to use the unsafe fast defer function for cleaning up
	 * threads. This might be able to throw, so be careful. If you're getting
	 * any thread related errors, chances are it is this.
	 */
	public UnsafeThreadCleanup: boolean;

	/**
	 * Instantiates a new Janitor object.
	 */
	public constructor();

	/**
	 * Adds an {@linkcode object} to Janitor for later cleanup, where
	 * {@linkcode methodName} is the key of the method within {@linkcode object}
	 * which should be called at cleanup time.
	 *
	 * If the {@linkcode methodName} is `true` the {@linkcode object} itself
	 * will be either called if it is a function or have `task.cancel` called on
	 * it if it is a thread.
	 *
	 * If passed an {@linkcode index} it will occupy a namespace which can be
	 * {@linkcode Janitor.Remove}'d or overwritten. Returns the
	 * {@linkcode object}.
	 * 
	 * @example
	 * import { Workspace, TweenService } from "@rbxts/services";
	 * import { Janitor } from "@rbxts/janitor";
	 * 
	 * const obliterator = new Janitor<{ CurrentTween: Tween }>();
	 * const part = Workspace.FindFirstChild("Part") as Part;
	 * 
	 * // Queue the part to be Destroyed at Cleanup time
	 * obliterator.Add(part, "Destroy");
	 * 
	 * // Queue function to be called with `true` methodName
	 * obliterator.Add(print, true);
	 * 
	 * // Close a thread.
	 * obliterator.Add(task.defer(() => {
	 * 		while (true) {
	 * 			 print("Running!");
	 * 			task.wait(0.5);
	 * 		}
	 * }), true);
	 * 
	 * // This implementation allows you to specify behavior for any object
	 * obliterator.Add(TweenService.Create(part, new TweenInfo(1), { Size: Vector3.one }), "Cancel");
	 * 
	 * // By passing an index, the object will occupy a namespace
	 * // If "CurrentTween" already exists, it will call :Remove("CurrentTween") before writing
	 * obliterator.Add(TweenService.Create(part, new TweenInfo(1), { Size: Vector3.one }), "Destroy", "CurrentTween");
	 *
	 * @param object The object you want to clean up.
	 * @param methodName The name of the method that will be used to clean up. If not passed, it will first check if the object's type exists in TypeDefaults, and if that doesn't exist, it assumes `Destroy`.
	 * @param index The index that can be used to clean up the object manually.
	 * @returns The object that was passed as the first argument.
	 */
	public Add<
		O extends keyof U extends never
			? object
			: I extends keyof U
				? U[I]
				: M extends true
					? Callback | thread
					: M extends undefined
						? { Destroy(): void } | RBXScriptConnection
						: object,
		M extends ((_: O) => void) | ((this: O) => void) | ExtractKeys<O, () => void> | true | undefined,
		I extends keyof U | undefined = undefined,
	>(object: O, methodName?: M, index?: I): O;

	/**
	 * Adds a {@linkcode Promise} to the Janitor. If the Janitor is cleaned up and the
	 * {@linkcode Promise} is not completed, the {@linkcode Promise} will be cancelled.
	 * 
	 * @example
	 * import { Janitor } from "@rbxts/janitor";
	 * 
	 * const obliterator = new Janitor();
	 * obliterator.AddPromise(Promise.delay(3)).andThenCall(print, "Finished!").catch(warn);
	 * task.wait(1);
	 * obliterator.Cleanup();
	 *
	 * @param promise The {@linkcode Promise} you want to add to the janitor.
	 * @param index The index that can be used to clean up the promise manually.
	 * @returns The {@linkcode promise} that was passed
	 */
	public AddPromise<
		// if you are curious how this works, here's a quick breakdown:
		// If `U` has no predefined keys (e.g., `U` is `void` or `{}`)
		// 	- Then `P` can be any Promise
		// elseif `U` has keys:
		// 	- If index `I` is one of those keys
		// 		- Then `P` must be of the type `U[I]` (which implies `U[I]` should be a Promise type)
		// 		- Else (`I` is undefined or not a key of `U`), `P` can be any Promise
		P extends keyof U extends never ? Promise<unknown> : I extends keyof U ? U[I] : Promise<unknown>,
		I extends keyof U | undefined = undefined,
	>(promise: P, index?: I): P;

	/**
	 * Constructs an object for you and adds it to the Janitor. It's really
	 * just "shorthand" for `janitor.Add(new Object(), methodName, index)`.
	 *
	 * @example
	 * import { Janitor } from "@rbxts/janitor";
	 *
	 * const obliterator = new Janitor();
	 * const subObliterator = obliterator.AddObject(Janitor, "Destroy");
	 *
	 * @param object The constructable class for the object you want to add to the Janitor.
	 * @param methodName The name of the method that will be used to clean up. If not passed, it will first check if the object's type exists in TypeDefaults, and if that doesn't exist, it assumes `Destroy`.
	 * @param index The index that can be used to clean up the object manually.
	 * @param parameters The arguments used to create the class.
	 * @returns The new constructed object from the passed {@linkcode object} class.
	 */
	public AddObject<
		O extends Constructable<unknown>,
		T extends InstanceType<O>,
		M extends ExtractKeys<T, () => void> | true | undefined,
		I extends keyof U | undefined = undefined,
	>(object: O, methodName?: M, index?: I, ...parameters: ConstructorParameters<O>): T;

	/**
	 * Cleans up whatever `object` was set to this namespace by the 3rd
	 * parameter of {@linkcode Janitor.Add}.
	 * 
	 * @example
	 * import { Workspace } from "@rbxts/services";
	 * import { Janitor } from "@rbxts/janitor";
	 * 
	 * const obliterator = new Janitor<{ Baseplate: Part }>();
	 * obliterator.Add(Workspace.FindFirstChild("Baseplate") as Part, "Destroy", "Baseplate");
	 * obliterator.Remove("Baseplate");
	 *
	 * @param index The index you want to remove.
	 * @returns The same {@linkcode Janitor}, for chaining reasons.
	 */
	public Remove(index: keyof U): this;

	/**
	 * Removes an object from the {@linkcode Janitor} without running a cleanup.
	 *
	 * @example
	 * import { Janitor } from "@rbxts/janitor";
	 *
	 * const obliterator = new Janitor<{ readonly Function: () => void }>();
	 * obliterator.Add(() => print("Removed!"), true, "Function");
	 *
	 * obliterator.RemoveNoClean("Function"); // Does not print.
	 *
	 * @param index The index you are removing.
	 * @returns The same {@linkcode Janitor}, for chaining reasons.
	 */
	public RemoveNoClean(index: keyof U): this;

	/**
	 * Cleans up multiple objects at once.
	 * @param indices The indices you want to remove.
	 * @returns The same {@linkcode Janitor}, for chaining reasons.
	 */
	public RemoveList(...indices: Array<keyof U>): this;

	/**
	 * Cleans up multiple objects at once without running their cleanup.
	 *
	 * @example
	 * import { Janitor } from "@rbxts/janitor";
	 *
	 * type NoOp = () => void
	 *
	 * const obliterator = new Janitor<{ One: NoOp, Two: NoOp, Three: NoOp }>();
	 * obliterator.Add(() => print("Removed One"), true, "One");
	 * obliterator.Add(() => print("Removed Two"), true, "Two");
	 * obliterator.Add(() => print("Removed Three"), true, "Three");
	 *
	 * obliterator.RemoveListNoClean("One", "Two", "Three"); // Nothing is printed.
	 *
	 * @param indices The indices you want to remove.
	 * @returns The same {@linkcode Janitor}, for chaining reasons.
	 */
	public RemoveListNoClean(...indices: Array<keyof U>): this;

	/**
	 * Gets whatever object is stored with the given {@linkcode index}, if it exists. This
	 * was added since Maid allows getting the task using `__index`.
	 * 
	 * @example
	 * import { Workspace } from "@rbxts/services";
	 * import { Janitor } from "@rbxts/janitor";
	 * 
	 * const obliterator = new Janitor<{ Baseplate: Part }>();
	 * obliterator.Add(Workspace.FindFirstChild("Baseplate") as Part, "Destroy", "Baseplate");
	 * print(obliterator.Get("Baseplate")); // Returns Baseplate.
	 *
	 * @param index The index that the object is stored under.
	 * @returns This will return the object if it is found, but it won't return anything if it doesn't exist.
	 */
	public Get<T extends keyof U>(index: T): U[T] | undefined;

	/**
	 * Returns a frozen copy of the Janitor's indices.
	 *
	 * @example
	 * import { Workspace } from "@rbxts/services";
	 * import { Janitor } from "@rbxts/janitor";
	 *
	 * const obliterator = new Janitor<{ Baseplate: Part }>();
	 * obliterator.Add(Workspace.FindFirstChild("Baseplate") as Part, "Destroy", "Baseplate");
	 * print(obliterator.GetAll().Baseplate); // Prints Baseplate.
	 *
	 * @returns A frozen object containing all the indices and their corresponding objects.
	 */
	public GetAll(): { readonly [P in keyof U]: U[P] | undefined };

	/**
	 * Calls each object's specified `methodName`. If `methodName` is `true`,
	 * the object itself will be invoked as a function or cancelled if it's a
	 * thread. Each object is then removed from the Janitor, and the namespace
	 * is cleared. This method is also invoked when the Janitor instance itself
	 * is called, allowing it to be used as a destructor callback.
	 */
	public Cleanup(): void;

	/**
	 * Calls {@linkcode Janitor.Cleanup} and renders the Janitor unusable. Any
	 * further calls will throw an error.
	 */
	public Destroy(): void;

	/**
	 * "Links" this Janitor to an `Instance`, such that the Janitor will
	 * {@linkcode Cleanup} when the `Instance` is {@linkcode Instance.Destroy}'d
	 * and garbage collected.
	 *
	 * A Janitor may only be linked to one instance at a time, unless
	 * {@linkcode allowMultiple} is `true`.
	 *
	 * When called with a truthy {@linkcode allowMultiple} parameter, the
	 * Janitor will "link" the Instance without overwriting any previous links,
	 * and will also not be overridable.
	 *
	 * When called with a falsy {@linkcode allowMultiple} parameter, the Janitor
	 * will overwrite the previous link which was also called with a falsy
	 * {@linkcode allowMultiple} parameter, if applicable.
	 * 
	 * @example
	 * import { Janitor } from "@rbxts/janitor";
	 * 
	 * const obliterator = new Janitor();
	 * obliterator.Add(() => print("Cleaning up!"), true);
	 * 
	 * {
	 * 	const folder = new Instance("Folder");
	 * 	obliterator.LinkToInstance(folder, false);
	 * 	folder.Destroy();
	 * }
	 *
	 * @param object The {@linkcode Instance} you want to link the Janitor to.
	 * @param allowMultiple Whether or not to allow multiple links on the same Janitor.
	 * @returns A {@linkcode RBXScriptConnection} that can be disconnected to prevent the cleanup of {@linkcode Janitor.LinkToInstance}.
	 */
	public LinkToInstance(object: Instance, allowMultiple: boolean): RBXScriptConnection;

	/**
	 * Links several instances to a janitor, which is then returned.
	 * @param instances All the {@linkcode Instance}s you want linked.
	 * @returns A new {@linkcode Janitor} that can be used to manually disconnect all LinkToInstances.
	 */
	public LinkToInstances(...instances: Array<Instance>): Janitor;

	/**
	 * Determines if the passed object is a Janitor.
	 * @param object The object you are checking.
	 * @returns Whether or not the object is a Janitor.
	 */
	public static Is: <T extends object>(object: unknown) => object is Janitor<T>;
}
