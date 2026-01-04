local DEFAULT_SUFFIX_TABLE = {
	"k",
	"M",
	"B",
	"T",
	"Qd",
	"Qn",
	"Sx",
	"Sp",
	"O",
	"N",
	"De",
	"Ud",
	"DD",
	"tdD",
	"QnD",
	"SxD",
	"SpD",
	"OcD",
	"NvD",
	"VgN",
	"UvG",
	"DvG",
	"TvG",
	"QtV",
	"QnV",
	"SeV",
	"SpG",
	"OvG",
	"NvG",
	"TgN",
	"UtG",
	"DtG",
	"TsTg",
	"QtTg",
	"QnTg",
	"SsTg",
	"SpTg",
	"OcTg",
	"NoTg",
	"QdDr",
	"UnAg",
	"DuAg",
	"TeAg",
	"QdAg",
	"QnAG",
	"SxAg",
	"SpAg",
	"OcAg",
	"NvAg",
	"CT",
}

local setSetting = require(script.setSetting).setSetting
local numberToString = require(script.numberToString).numberToString
local numbersToSortedString = require(script.numbersToSortedString).numbersToSortedString
local stringToNumber = require(script.stringToNumber).stringToNumber
local commify = require(script.commify).commify

return {
	new = function()
		return {
			_suffixTable = DEFAULT_SUFFIX_TABLE,
			_decimalPlaces = 2,
			_stripTrailingZeroes = false,

			setSetting = setSetting,
			numberToString = numberToString,
			numbersToSortedString = numbersToSortedString,
			stringToNumber = stringToNumber,
			commify = commify,
		}
	end,
}
