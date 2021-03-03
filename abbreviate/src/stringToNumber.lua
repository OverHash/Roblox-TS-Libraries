function stringToNumber(self, str)
	if not (str and type(str) == 'string') then
		error('stringToNumber had invalid parameters.\nP1 - string: string', 2)
	end

	local totalMagnitude = 1

	for key, suffix in pairs(self._suffixTable) do
		str = string.gsub(str, suffix, function()
			totalMagnitude = totalMagnitude * (10 ^ (key * 3))
			return ''
		end)
	end

	-- validate that user passed an actual string that we can convert to number
	if not tonumber(str) then
		error('stringToNumber invalid parameter #1: Expected a string which could be converted to a number, got "'..str..'"', 2)
	end

	return totalMagnitude * str
end

return {
	stringToNumber = stringToNumber,
}
