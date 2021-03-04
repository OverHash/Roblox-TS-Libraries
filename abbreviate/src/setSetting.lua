function setSetting(self, settingName, settingValue)
	if not (settingName and settingValue ~= nil and type(settingName) == 'string') then
		error('setSetting had invalid parameters.\nP1 - settingName: string\nP2 - settingValue: unknown', 2)
	end
	local realSetting = '_' .. settingName

	if self[realSetting] ~= nil and type(self[realSetting]) ~= 'function' then
		self[realSetting] = settingValue
	else
		if self[realSetting] ~= nil then
			error('Attempt to index setting ' ..settingName..' which is not an editable field.');
		else
			error('Attempt to index setting ' ..settingName..' which is not a valid setting!');
		end
	end
end

return {
	setSetting = setSetting,
}
