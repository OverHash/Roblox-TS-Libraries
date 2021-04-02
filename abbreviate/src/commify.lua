local function commify(self, number)
	assert(type(number) == 'number', 'Attempt to commify a non-number value')

	local formatted = tostring(number)
	while true do
		local newFormatted, k = string.gsub(formatted, "^(-?%d+)(%d%d%d)", '%1,%2')
		formatted = newFormatted
		if k == 0 then
			break
		end
	end
	return formatted
end

return {
	commify = commify,
}
