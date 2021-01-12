import { ProfileStore } from "./globals";

declare namespace ProfileService {
	/**
	 * Set to false when the Roblox server is shutting down. ProfileStore methods should not be called after this value is set to false
	 */
	const ServiceLocked: boolean;
	/**
	 * Analytics endpoint for DataStore error logging. Example usage:
	 * @example
	 *	ProfileService.IssueSignal:Connect((errorMessage, profileStoreName, profileKey) => {
	 *		pcall(() => {
	 *			AnalyticsService.FireEvent("ProfileServiceIssue", errorMessage, profileStoreName, profileKey)
	 *	   })
	 *	})
	 */
	const IssueSignal: RBXScriptSignal<(errorMessage: string, profileStoreName: string, profileKey: string) => void>;

	/**
	 * Analytics endpoint for cases when a DataStore key returns a value that has all or some of it's profile components set to invalid data types. E.g., accidentally setting Profile.Data to a non table value
	 */
	const CorruptionSignal: RBXScriptSignal<(profileStoreName: string, profileKey: string) => void>;

	/**
	 * Analytics endpoint for cases when DataStore is throwing too many errors and it's most likely affecting your game really really bad - this could be due to developer errors or due to Roblox server problems. Could be used to alert players about data store outages.
	 */
	const CriticalStateSignal: RBXScriptSignal<(isCriticalState: boolean) => void>;

	/**
	 * ProfileStore objects expose methods for loading / viewing profiles and sending global updates. Equivalent of .GetDataStore() in Roblox DataStoreService API.
	 *
	 * `ProfileStore` objects expose methods for loading / viewing profiles and sending global updates. Equivalent of []:GetDataStore()](https://developer.roblox.com/en-us/api-reference/function/DataStoreService/GetDataStore) in Roblox [DataStoreService](https://developer.roblox.com/en-us/api-reference/class/DataStoreService) API.
	 *
	 * @see By default, `profileTemplate` is only copied for `Profile.Data` for new profiles. Changes made to `profileTemplate` can be applied to `Profile.Data` of previously saved profiles by calling [Profile.Reconcile()](https://madstudioroblox.github.io/ProfileService/api/#profilereconcile). You can also create your own function to fill in the missing components in `Profile.Data` as soon as it is loaded or have `nil` exceptions in your personal `.Get()` and `.Set()` method libraries.
	 * @param profileStoreName DataStore name
	 * @param profileTemplate Profile.Data will default to given table (deep-copy) when no data was previously saved.
	 */
	const GetProfileStore: <playerData extends object>(
		profileStoreName: string,
		profileTemplate: playerData,
	) => ProfileStore<playerData>;
}

export = ProfileService;
