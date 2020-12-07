declare class abbreviator {
	/**
	 * Sets a setting
	 * @param settingName The name of the setting to set
	 * @param settingValue The value of the setting to set
	 */
	setSetting(settingName: "suffixTable", settingValue: Array<string>): void;
	setSetting(settingName: "decimalPlaces", settingValue: number): void;

	/**
	 * Converts a number of full length into a string with a suffix as defined in the prefix table
	 * @param number The number to convert into a abbreviated string
	 */
	numberToString(number: number): string;

	/**
	 * Converts a string that has a suffix as defined in the suffix table to a full number
	 * @param str The string to convert into a number
	 */
	stringToNumber(str: string): number;
}

declare function createAbbreviator(): abbreviator;

export = createAbbreviator;
