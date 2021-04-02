export type notReleasedHandlerFunc = (
	placeId: number,
	gameJobId: string,
) => "Repeat" | "Cancel" | "ForceLoad" | "Steal";
export type GlobalUpdateHandler = (globalUpdates: GlobalUpdates) => void;
export type GlobalUpdateData = {
	[index: string]: unknown;
	Type: string;
};

/**
 * Global updates is a powerful feature of ProfileService, used for sending information to a desired player profile across servers, within the server or to a player profile that is not currently active in any Roblox server (Kind of like [MessagingService](https://developer.roblox.com/en-us/api-reference/class/MessagingService), but slower and doesn't require the recipient to be active). The primary intended use of global updates is to support sending gifts among players, or giving items to players through a custom admin tool. The benefit of using global updates is it's API simplicity (This is as simple as it gets, sorry 😂) and the fact that global updates are pulled from the DataStore whenever the profile is auto-saved **at no additional expense of more DataStore calls!**
 *
 * Global updates can be `Active`, `Locked` and `Cleared`:
 * - Whenever a GlobalUpdate is created, it will be `Active` by default
 * - `Active` updates can be **changed** or **cleared** within a `.GlobalUpdateProfileAsync()` call
 * - Normally, when the profile is active on a Roblox server, you should always progress all `Active` updates to the `Locked` state.
 * - `Locked` updates can no longer be **changed** or **cleared** within a `.GlobalUpdateProfileAsync()` call.
 * - `Locked` updates are ready to be processed (e.g. add gift to player inventory) and immediately `Locked` by calling `.LockActiveUpdate(updateId)`
 * - `Cleared` updates will immediately disappear from the profile forever.
 */
export interface GlobalUpdates {
	/**
	 * [[updateId, updateData]]
	 *
	 * Should be used immediately after a `Profile` is loaded to scan and progress any pending `Active` updates to a `Locked` state:
	 * @example
	 * for (const update of profile.GlobalUpdates.GetActiveUpdates()) {
	 * 	profile.GlobalUpdates.LockActiveUpdate(update[0]);
	 * }
	 */
	GetActiveUpdates(): Array<[number, GlobalUpdateData]>;

	/**
	 * Should be used immediately after a `Profile` is loaded to scan and progress any pending Locked updates to `Cleared` state:
	 * @example
	 * for (const update of profile.GlobalUpdates.GetLockedUpdates()) {
	 * 	const updateId = update[0];
	 * 	const updateData = update[1];
	 *
	 * 	if (updateData.Type === "AdminGift" && updateData.Item == "Coins") {
	 * 		profile.Data.Coins += updateData.Amount;
	 * 	}
	 *
	 * 	profile.GlobalUpdates.ClearLockedUpdate(updateId);
	 * }
	 */
	GetLockedUpdates(): Array<[number, GlobalUpdateData]>;

	/**
	 * In most games, you should progress all Active updates to Locked state:
	 * @example
	 * profile.GlobalUpdates.ListenToNewActiveUpdate((updateId, updateData) => profile.GlobalUpdates.LockActiveUpdate(updateId));
	 * @param listener The listener for new active updates.
	 */
	ListenToNewActiveUpdate(listener: (updateId: number, updateData: GlobalUpdateData) => void): RBXScriptSignal;

	/**
	 * When you get a Locked update via `GlobalUpdates.ListenToNewLockedUpdate()`, the update is ready to be processed and immediately locked:
	 * @example
	 * profile.GlobalUpdates.ListenToNewLockedUpdate((updateId, updateData) => {
	 * 	if (updateData.Type === "AdminGift" && updateData.Item === "Coins") {
	 * 		profile.Data.Coins += updateData.Amount;
	 * 	}
	 * 	profile.GlobalUpdates.ClearLockedUpdate(updateId);
	 * })
	 * Must always call `GlobalUpdates.ClearLockedUpdate(updateId)` after processing the locked update.
	 * @param listener The listener for new locked updates.
	 */
	ListenToNewLockedUpdate(listener: (updateId: number, updateData: GlobalUpdateData) => void): RBXScriptSignal;

	/**
	 * Turns an `Active` update into a `Locked` update. Will invoke `GlobalUpdates.ListenToNewLockedUpdate()` after an auto-save (less than 30 seconds), or `Profile.Save()`.
	 *
	 * Do not call when profile has been released.
	 * @param updateId The id of the GlobalUpdate to lock.
	 */
	LockActiveUpdate(updateId: number): void;

	/**
	 * Clears a `Locked` update completely from the profile.
	 *
	 * Do not call when profile has been released.
	 */
	ClearLockedUpdate(updateId: number): void;

	/**
	 * Used to send a new `Active` update to the profile.
	 * @param updateData The new update
	 */
	AddActiveUpdate(updateData: GlobalUpdateData): void;

	/**
	 * Changing `Active` updates can be used for stacking player gifts, particularly when lots of players can be sending lots of gifts to a YouTube celebrity so the Profile would not exceed the DataStore data limit.
	 * @param updateId Id of an existing global update
	 * @param updateData New data that replaces previously set updateData
	 */
	ChangeActiveUpdate(updateId: number, updateData: GlobalUpdateData): void;

	/**
	 * Removes an `Active` update from the profile completely.
	 * @param updateId Id of an existing global update
	 */
	ClearActiveUpdate(updateId: number): void;
}

/**
 * An object containing data about the profile itself.
 */
export interface ProfileMetaData {
	/**
	 * os.time() timestamp of profile creation
	 */
	readonly ProfileCreateTime: number;
	/**
	 * Amount of times the profile was loaded
	 */
	readonly SessionLoadCount: number;
	/**
	 * [placeId, gameJobId] | nil
	 * Set to a session link if a Roblox server is currently the owner of this profile; nil if released
	 */
	readonly ActiveSession: [number, string] | undefined;
	/**
	 * Saved and auto-saved just like Profile.Data
	 */
	MetaTags: Map<string, unknown>;
	/**
	 * The most recent version of MetaData.MetaTags which has
	 * been saved to the DataStore during the last auto-save
	 * or `Profile.Save()` call
	 */
	MetaTagsLatest: Map<string, unknown>;
}

export interface Profile<DataType extends object> extends ViewProfile<DataType> {
	/**
	 * `Profile.Data` is the primary variable of a Profile object. The developer is free to read and write from the table while it is automatically saved to the [DataStore](https://developer.roblox.com/en-us/api-reference/class/DataStoreService). `Profile.Data` will no longer be saved after being released remotely or locally via `Profile.Release()`.
	 */
	Data: DataType;
	/**
	 * A table containing data about the profile itself.
	 */
	readonly MetaData: ProfileMetaData;
}

export interface ViewProfile<DataType extends object> {
	/**
	 * The primary variable of a Profile object. The developer is free to read and write from the table while it is automatically saved to the DataStore. `Profile.Data` will no longer be saved after being released remotely or locally via `Profile.Release()`.
	 */
	readonly Data: DataType | void;
	/**
	 * A table containing data about the profile itself.
	 */
	readonly MetaData: ProfileMetaData | void;
	/**
	 * This is the GlobalUpdates object tied to this specific Profile. It exposes GlobalUpdates methods for update processing. (See [Global Updates](https://madstudioroblox.github.io/ProfileService/api/#global-updates) for more info)
	 */
	GlobalUpdates: GlobalUpdates;
	/**
	 * Returns `true` while the profile is session-locked and saving of changes to Profile.Data is guaranteed.
	 */
	IsActive(): boolean;
	/**
	 * Equivalent of `Profile.MetaData.MetaTags.get(tagName)`.
	 * @see `Profile.SetMetaTag` for more info.
	 * @param tagName The tag name to retrieve
	 */
	GetMetaTags(tagName: string): unknown;

	/**
	 * Fills in missing variables inside `Profile.Data` from `profile_template` table that was provided when calling `ProfileService.GetProfileStore()`. It's often necessary to use `Reconcile()` if you're applying changes to your `profile_template` over the course of your game's development after release.
	 *
	 * The following function is used in the reconciliation process:
	 * ```lua
	 * local function ReconcileTable(target, template)
	 * 	for k, v in pairs(template) do
	 *    	if type(k) == "string" then -- Only string keys will be reconciled
	 *        	if target[k] == nil then
	 *            	if type(v) == "table" then
	 *                	target[k] = DeepCopyTable(v)
	 *            	else
	 *                	target[k] = v
	 *            	end
	 *        	elseif type(target[k]) == "table" and type(v) == "table" then
	 *            	ReconcileTable(target[k], v)
	 *        	end
	 *    	end
	 * 	end
	 * end
	 * ```
	 */
	Reconcile(): void;

	/**
	 * Listener functions subscribed to `Profile.ListenToRelease()` will be called when the profile is released remotely (Being `"ForceLoad"`'ed on a remote server) or locally (`Profile.Release()`). In common practice, the profile will rarely be released before the player leaves the game so it's recommended to simply [.Kick()](https://developer.roblox.com/en-us/api-reference/function/Player/Kick) the Player when this happens.
	 *
	 * You cannot modify `Profile.Data` once this has been triggered.
	 */
	ListenToRelease(listener: (placeId: number, jobId: string) => void): RBXScriptSignal;

	/**
	 * Removes the session lock for this profile for this Roblox server. Call this method after you're done working with the Profile object. Profile data will be immediately saved for the last time.
	 */
	Release(): void;

	/**
	 * In many cases ProfileService will be fast enough when loading and releasing profiles as the player teleports between places belonging to the same universe / game. However, if you're experiencing noticeable delays when loading profiles after a universe teleport, you should try implementing `:ListenToHopReady()`.
	 *
	 * A listener passed to `:ListenToHopReady()` will be executed after the releasing UpdateAsync call finishes. `:ListenToHopReady()` will usually call the listener in around a second, but may occasionally take up to 7 seconds when a profile is released next to an auto-update interval (regular usage scenario - rapid loading / releasing of the same profile key may yield different results).
	 *
	 * In short, `Profile:ListenToRelease()` and `Profile:ListenToHopReady()` will both execute the listener function after release, but `Profile:ListenToHopReady()` will additionally wait until the session lock is removed from the `Profile`.
	 * @param listener The listener to execute after the releasing UpdateAsync call finishes.
	 */
	ListenToHopReady(listener: () => void): RBXScriptSignal;
	
	/**
	 * Equivalent of `Profile.MetaData.MetaTags.set(tagName, value)`.
	 *
	 * Useful for tagging your profile with information about itself such as
	 * - DataVersion to let your code know whether `Profile.Data` needs anything converted after massive changes to the game.
	 * - Anything set through `profile.SetMetaTag(tagName, tagValue)` will be available through `profile.MetaData.MetaTagsLatest.get(tagName)` after an auto-save or a `.Save()` call - `Profile.MetaData.MetaTagsLatest` is a version of `Profile.MetaData.MetaTags` that has been successfully saved to the DataStore.
	 *
	 * You cannot call this method after a profile has been released.
	 * @param tagName The tag name
	 * @param value Any value supported by DataStores.
	 */
	SetMetaTag(tagName: string, value: unknown): void;

	/**
	 * Call `Profile.Save()` to quickly progress `GlobalUpdates` state or to speed up the propagation of `Profile.MetaData.MetaTags` changes to `Profile.MetaData.MetaTagsLatest`.
	 *
	 * Should **not** be called for saving `Profile.Data` or `Profile.MetaData.MetaTags` - this is already done for you automatically.
	 *
	 * Do not call when the profile has been released.
	 */
	Save(): void;
}

export interface ProfileStore<T extends object> {
	/**
	 * `ProfileStore.Mock` is a reflection of methods available in the `ProfileStore` object with the exception of profile operations being performed on profiles stored on a separate, detached "fake" DataStore that will be forgotten when the game session ends. You may load profiles of the same key from `ProfileStore` and `ProfileStore.Mock` in parallel - these will be two different profiles because the regular and mock versions of the same `ProfileStore` are completely isolated from each other.
	 *
	 * `ProfileStore.Mock` is useful for customizing your testing environment in cases when you want to [enable Roblox API services](https://developer.roblox.com/en-us/articles/Data-store#using-data-stores-in-studio) in studio, but don't want ProfileService to save to live keys:
	 * @example
	 * ```ts
	 * const RunService = game.GetService("RunService")
	 * let GameProfileStore = ProfileService.GetProfileStore("PlayerData", ProfileTemplate)
	 * if (RunService:IsStudio() === true) {
	 *		GameProfileStore = GameProfileStore.Mock
	 * }
	 * ```
	 * A few more things:

	 * - Even when Roblox API services are disabled, `ProfileStore` and `ProfileStore.Mock` will store profiles in separate stores.
	 * - It's better to think of `ProfileStore` and `ProfileStore.Mock` as two different ProfileStore objects unrelated to each other in any way.
	 * - It's possible to create a project that utilizes both live and mock profiles on live servers!
	 */
	Mock: ProfileStore<T>;
	/**
	 * For basic usage, pass `"ForceLoad"` for the `notReleasedHandler` argument.
	 *
	 * `notReleasedHandler` as a `function` argument is called when the profile is session-locked by a remote Roblox server:
	 *
	 * @example
	 * const profile = ProfileStore.LoadProfileAsync("Player_2312310", (placeId, gameJobId) => {
	 * 	// placeId and gameJobId identify the Roblox server that has
	 * 	// this profile currently locked. In rare cases, if the server
	 * 	// crashes, the profile will stay locked until ForceLoaded by
	 * 	// a new session.
	 * 	return "Repeat" || "Cancel" || "ForceLoad" || "Steal"
	 * })
	 * @param profileKey DataStore key
	 * @param notReleasedHandler Called when the profile is session-locked by a remote Roblox server. Must return one of the follow values:
	 *
	 * `"Repeat"` - ProfileService will repeat the profile loading process and may call the release handler again
	 * `"Cancel"` - `.LoadProfileAsync()` will immediately return nil
	 * `"ForceLoad"` - ProfileService will indefinitely attempt to load the profile. If the profile is session-locked by a remote Roblox server, it will either be released for that remote server or "stolen" (Stealing is necessary for remote servers that are not responding in time and for handling crashed server session-locks).
	 * `"Steal"` - The profile will usually be loaded immediately, ignoring an existing remote session lock and applying a session lock for this session. `"Steal"` can be used to clear dead session locks faster than `"ForceLoad"` assuming your code knows that the session lock is dead.
	 */
	LoadProfileAsync(
		profileKey: string,
		notReleasedHandler: "ForceLoad" | "Steal" | notReleasedHandlerFunc,
	): Profile<T> | undefined;

	/**
	 * Used to create and manage `Active` global updates for a specified Profile. Can be called on any Roblox server of your game. Updates should reach the recipient in less than 30 seconds, regardless of whether it was called on the same server the Profile is session-locked to. See [Global Updates](https://madstudioroblox.github.io/ProfileService/api/#global-updates) for more information.
	 * `GlobalUpdateProfileAsync()` will work for profiles that haven't been created (profiles are created when they're loaded using `.LoadProfileAsync()` for the first time)
	 * @example
	 * ProfileStore.GlobalUpdateProfileAsync("Player_2312310", (globalUpdates) => {
	 * 	globalUpdates.AddActiveUpdate({
	 *			Type: "AdminGift",
	 *			Item: "Coins",
	 *			Amount: 1000,
	 * 	})
	 * })
	 * @param profileKey DataStore key
	 * @param updateHandler This function is called with a GlobalUpdates object
	 */
	GlobalUpdateProfileAsync(profileKey: string, updateHandler: GlobalUpdateHandler): GlobalUpdates | void;

	/**
	 * Writing and saving is not possible for profiles in view mode. `Profile.Data` and `Profile.MetaData` will be `nil` if the profile hasn't been created.
	 * @param profileKey DataStore key
	 */
	ViewProfileAsync(profileKey: string): Profile<T> | undefined;

	/**
	 * Use `WipeProfileAsync()` to erase user data when complying with right of erasure requests. In live Roblox servers `WipeProfileAsync()` must be used on profiles created through `ProfileStore.Mock` after `Profile.Release()` and it's known that the `Profile` will no longer be loaded again.
	 * @param profileKey The key to wipe
	 * @returns If the wipe was successful or not
	 */
	WipeProfileAsync(profileKey: string): boolean;
}
