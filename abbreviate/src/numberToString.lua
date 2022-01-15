local function round(number, decimalPlaces, roundDown)
	number = number * 10 ^ decimalPlaces
	if roundDown then
		return math.floor(number) / 10 ^ decimalPlaces
	else
		number = tonumber(string.format("%.14g", number))
		-- cast to string and back to number to give some epsilon for floating point numbers
		--[[ e.g.:
			local number = 1005 / 10^3 * 10^2 + 0.5 -- 101
			print(number, math.floor(number))
			> 101 100

			local number = 1005 / 10^3 * 10^2 + 0.5 -- 101
			number = tonumber(tostring(number))
			print(number, math.floor(number))
			> 101 101
		]]
		return math.floor(number + 0.5) / 10 ^ decimalPlaces
	end
end

local function numberToString(self, number, roundDown)
	if type(number) ~= "number" then
		error('numberToString invalid parameter #1, expected number, got "nil"', 2)
	end

	if roundDown == nil then
		roundDown = true
	end

	if number < 1000 and number > -1000 then
		-- special case: we must manually abbreviate numbers between -1000 and 1000
		if not self._stripTrailingZeroes then
			return ("%." .. self._decimalPlaces .. "f"):format(number)
		else
			number = round(number, self._decimalPlaces, roundDown)
			return tostring(number)
		end
	end

	local negative = number < 0
	number = math.abs(math.floor(number))

	for index = #self._suffixTable, 1, -1 do
		local unit = self._suffixTable[index]
		local size = 10 ^ (index * 3)

		if size <= number then
			number = round(number / size, self._decimalPlaces, roundDown)

			if number == 1000 and index < #self._suffixTable[index] then
				number = 1
				unit = self._suffixTable[index][index + 1]
			end

			if not self._stripTrailingZeroes then
				number = ("%." .. self._decimalPlaces .. "f"):format(number)
			end

			number = number .. unit
			break
		end
	end

	if negative then
		return "-" .. number
	else
		return tostring(number)
	end
end

return {
	numberToString = numberToString,
}
