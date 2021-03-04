declare class Abbreviator {
	/**
	 * Sets a setting
	 * @param settingName The name of the setting to set
	 * @param settingValue The value of the setting to set
	 */
	setSetting(settingName: "suffixTable", settingValue: Array<string>): void;
	setSetting(settingName: "decimalPlaces", settingValue: number): void;
	setSetting(settingName: "stripTrailingZeroes", settingValue: boolean): void;

	/**
	 * Separates a number by the thousands of places with commas.
	 * @example
	 * 10 => "10"
	 * 10.1234 => "10.1234"
	 * 1000 => "1,400"
	 * 123456789 => "123,456,789"
	 * 1234567890 => "1,234,567,890"
	 * @param number The number to comma separate
	 */
	commify(number: number): string;

	/**
	 * Converts a number of full length into a string with a suffix as defined in the prefix table
	 * @param number The number to convert into a abbreviated string
	 * @param roundDown If the abbreviation should round up or down. @default down.
	 */
	numberToString(number: number, roundDown?: boolean): string;

	/**
	 * Converts an array of numbers into sorted strings with a suffix as defined in the prefix table
	 * @param numbers The numbers to abbreviate and sort correctly
	 * @example
	 * ```ts
	 * const abbreviator = createAbbreviator();
	 * abbreviator.setSetting("decimalPlaces", 2);
	 *
	 * const nums = ["7.1M", "87.2M", "23.5M", "8.0k", "1.0B", "15B", "999.99k"].map((x) => abbreviator.stringToNumber(x));
	 *
	 * const sortedNumbers = abbreviator.numbersToSortedString(nums);
	 * table.sort(sortedNumbers, (a, b) => a < b);
	 *
	 * print(sortedNumbers);
	 * ```
	 * 
	 * will produce
	 * ```
	 * {
	 *		[1] = "​​​⁠8.00k",
	 *		[2] = "​​⁠​999.99k",
	 *		[3] = "​​⁠⁠7.10M",
	 *		[4] = "​⁠​​23.50M",
	 *		[5] = "​⁠​⁠87.20M",
	 *		[6] = "​⁠⁠​1.00B",
	 *		[7] = "​⁠⁠⁠15.00B"
	 * }
	 *
	```
	 */
	numbersToSortedString(numbers: Array<number>): Array<string>;

	/**
	 * Converts a string that has a suffix as defined in the suffix table to a full number
	 * @param str The string to convert into a number
	 */
	stringToNumber(str: string): number;

	constructor();
}

export = Abbreviator;
