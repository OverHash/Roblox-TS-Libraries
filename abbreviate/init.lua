local DEFAULT_SUFFIX_TABLE = {
	'k',
	'M',
	'B',
	'T',
	'Qd',
	'Qn',
	'Sx',
	'Sp',
	'O',
	'N',
	'De',
	'Ud',
	'DD',
	'tdD',
	'QnD',
	'SxD',
	'SpD',
	'OcD',
	'NvD',
	'VgN',
	'UvG',
	'DvG',
	'TvG',
	'QtV',
	'QnV',
	'SeV',
	'SpG',
	'OvG',
	'NvG',
	'TgN',
	'UtG',
	'DtG',
	'TsTg',
	'QtTg',
	'QnTg',
	'SsTg',
	'SpTg',
	'OcTg',
	'NoTg',
	'QdDr',
	'UnAg',
	'DuAg',
	'TeAg',
	'QdAg',
	'QnAG',
	'SxAg',
	'SpAg',
	'OcAg',
	'NvAg',
	'CT'
}

return function()

	local module = {}

	module._suffixTable = DEFAULT_SUFFIX_TABLE
	module._decimalPlaces = 2

	function module:setSetting(settingName, settingValue)
		if not (settingName and settingValue and type(settingName) == 'string') then
			error('setSetting had invalid parameters.\nP1 - settingName: string\nP2 - settingValue: unknown', 2)
		end
		local realSetting = '_' .. settingName

		if module[realSetting] and not type(module[realSetting]) == 'function' then
			module[realSetting] = settingValue
		end
	end

	function module:numberToString(number)
		if not (number and type(number) == 'number') then
			error('numberToString had invalid parameters.\nP1 - number: number', 2)
		end

		if number < 1000 then
			return tostring(number)
		end

		for index = #module._suffixTable, 1, -1 do
			local shortenedNumber = 10 ^ (index * 3)

			if number >= shortenedNumber then
				local suffix = module._suffixTable[index]
				return string.format('%.'..module._decimalPlaces..'f'..suffix, number / shortenedNumber)
			end
		end
	end

	function module:stringToNumber(str)
		if not (str and type(str) == 'string') then
			error('stringToNumber had invalid parameters.\nP1 - string: string', 2)
		end

		local totalMagnitude = 1

		for key, suffix in pairs(module._suffixTable) do
			str = string.gsub(str, suffix, function()
				totalMagnitude = totalMagnitude * (10 ^ (key * 3))
				return ''
			end)
		end

		return totalMagnitude * str
	end

	return module
end