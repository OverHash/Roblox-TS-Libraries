import { ProfileStore } from '@rbxts/profileservice/globals';

declare namespace ProfileService {
	/**
	 * Set to false when the Roblox server is shutting down. ProfileStore methods should not be called after this value is set to false
	 */
	const ServiceLocked: boolean;
	/**
	 * Analytics endpoint for DataStore error logging. Example usage:
	 * @example
	 *	ProfileService.IssueSignal:Connect((errorMessage) => {
	 *		pcall(() => {
	 *			AnalyticsService.FireEvent("ProfileServiceIssue", errorMessage)
	 *	   })
	 *	})
	 */
	const IssueSignal: RBXScriptSignal<(errorMessage: string) => void>;

	/**
	 * Analytics endpoint for cases when a DataStore key returns a value that has all or some of it's profile components set to invalid data types. E.g., accidentally setting Profile.Data to a non table value
	 */
	const CorruptionSignal: RBXScriptSignal<(profileStoreName: string, profileKey: string) => void>;

	/**
	 * Analytics endpoint for cases when DataStore is throwing too many errors and it's most likely affecting your game really really bad - this could be due to developer errrors or due to Roblox server problems. Could be used to alert players about data store outages.
	 */
	const CriticalStateSignal: RBXScriptSignal<(isCriticalState: boolean) => void>;

	/**
	 * ProfileStore objects expose methods for loading / viewing profiles and sending global updates. Equivalent of .GetDataStore() in Roblox DataStoreService API.
	 * @param profileStoreName The DataStore name
	 * @param profileTemplate Profile.Data will default to given table (deep-copy) when no data was previously saved.
	 */
	const GetProfileStore: <playerData extends Object>(profileStoreName: string, profileTemplate: playerData) => ProfileStore<playerData>;
}

export = ProfileService;