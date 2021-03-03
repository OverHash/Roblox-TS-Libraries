function numberToString(self, number, roundDown)
	if type(number) ~= "number" then
		error('numberToString invalid parameter #1, expected number, got "nil"', 2)
	end

	if number < 1000 and number > -1000 then
		-- special case: we must manually abbreviate numbers between -1000 and 1000
		return ("%."..self._decimalPlaces.."f"):format(number)
	end

	if roundDown == nil then
		roundDown = true
	end

	local negative = number < 0
	number = math.abs(math.floor(number))

	for index = #self._suffixTable, 1, -1 do
		local unit = self._suffixTable[index]
		local size = 10 ^ (index * 3)

		if size <= number then
			if roundDown then
				number = math.floor(number * 10^self._decimalPlaces / size) / 10^self._decimalPlaces
			else
				number = math.floor((number * 10^self._decimalPlaces / size) + 0.5) / 10^self._decimalPlaces
			end

			if number == 1000 and index < #self._suffixTable[index] then
				number = 1
				unit = self._suffixTable[index][index + 1]
			end

			number = ("%."..self._decimalPlaces.."f"):format(number) .. unit
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
