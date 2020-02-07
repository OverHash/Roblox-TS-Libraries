declare class abbreviator {
	setSetting(settingName: 'suffixTable', settingValue: Array<string>): void;
	setSetting(settingName: 'decimalPlaces', settingValue: number): void;

	numberToString(number: number): void;

	stringToNumber(str: string): void;
}

declare function createAbbreviator(): abbreviator;

export = createAbbreviator;