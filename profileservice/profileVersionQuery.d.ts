import { ViewProfile } from './globals';

export interface ProfileVersionQuery<T extends object, RobloxMetaData extends unknown = unknown> {
	/**
	 * Retrieves the next Profile available.
	 */
	NextAsync(): ViewProfile<T, RobloxMetaData> | undefined;
}