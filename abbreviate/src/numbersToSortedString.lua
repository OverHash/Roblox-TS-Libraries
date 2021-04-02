-- Credits to Coreccii for this method
local hexToBin = {
	["0"] = "0000",
	["1"] = "0001",
	["2"] = "0010",
	["3"] = "0011",
	["4"] = "0100",
	["5"] = "0101",
	["6"] = "0110",
	["7"] = "0111",
	["8"] = "1000",
	["9"] = "1001",
	["A"] = "1010",
	["B"] = "1011",
	["C"] = "1100",
	["D"] = "1101",
	["E"] = "1110",
	["F"] = "1111",
}

local binToUnicodeAscending = table.create(16)
local binToUnicodeDescending = table.create(16)

for hex, bin in pairs(hexToBin) do
	binToUnicodeAscending[hex] = bin.gsub(bin, ".", {["0"] = "\u{200B}", ["1"] = "\u{2060}"})
	binToUnicodeDescending[hex] = bin.gsub(bin, ".", {["1"] = "\u{200B}", ["0"] = "\u{2060}"})
end

-- Usage: getSortablePrefix(sortOrder: number, maximumSortOrder: number, descending?: false): string
local function getSortablePrefix(num, maxNum, descending)
	local maxSize = math.ceil(math.log(maxNum) / math.log(16))
	local maxSizeString = string.format("%d", maxSize)

	local numHex = string.format("%0" .. maxSizeString .. "X", num)
	return (string.gsub(numHex, ".", descending and binToUnicodeDescending or binToUnicodeAscending))
end

local function round(number, decimalPlaces, roundDown)
	number = number * 10^decimalPlaces
	if roundDown then
		return math.floor(number) / 10^decimalPlaces
	else
		number = tonumber(tostring(number))
		-- cast to string and back to number to prevent floating point errors
		return math.floor(number + 0.5) / 10^decimalPlaces
	end
end

local function numbersToSortedString(self, numbers)
	if not (numbers and type(numbers) == 'table') then
		error('numbersToSortedString had invalid parameters.\nP1 - numbers: Array<number>', 2)
	end

	local numbersSize = #numbers

	local sortedNumbers = table.create(numbersSize)

	-- Validate and create the numbers
	for index, number in ipairs(numbers) do
		if type(number) ~= 'number' then
			error('numbersToSortedString had invalid parameters.\nP1 - numbers: Array<number>', 2)
		end

		table.insert(sortedNumbers, {
			initialIndex = index,
			value = number
		})
	end

	-- Sort
	table.sort(sortedNumbers, function(a, b)
		return a.value < b.value
	end)

	-- Make return result
	local returnResult = table.create(numbersSize)
	for sortedIndex, numberData in ipairs(sortedNumbers) do
		if numberData.value < 1000 then
			if not self._stripTrailingZeroes then
				returnResult[numberData.initialIndex] = string.format('%.'..self._decimalPlaces..'f', numberData.value)
			else
				returnResult[numberData.initialIndex] = tostring(round(numberData.value, self._decimalPlaces))
			end
		end

		for index = #self._suffixTable, 1, -1 do
			local shortenedNumber = 10 ^ (index * 3)

			if numberData.value >= shortenedNumber then
				local suffix = self._suffixTable[index]

				local prefixed

				if not self._stripTrailingZeroes then
					prefixed = string.format('%.'..self._decimalPlaces..'f', numberData.value / shortenedNumber)
				else
					prefixed = tostring(round(numberData.value / shortenedNumber, self._decimalPlaces))
				end

				returnResult[numberData.initialIndex] = getSortablePrefix(sortedIndex, numbersSize, false)..prefixed..suffix
				break
			end
		end

	end

	return returnResult
end

return {
	numbersToSortedString = numbersToSortedString,
}
