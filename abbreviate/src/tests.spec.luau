-- Disable ANSI colors from Jest
_G.NOCOLOR = true

local ReplicatedStorage = game:GetService("ReplicatedStorage")

local JestGlobals = require(ReplicatedStorage.DevPackages.JestGlobals)
local describe = JestGlobals.describe
local expect = JestGlobals.expect
local it = JestGlobals.it
local beforeEach = JestGlobals.beforeEach

local abbreviate

local function realDescribe(str, callback)
	beforeEach(function()
		abbreviate = require(script.Parent).new()
	end)

	return describe(str, callback)
end

realDescribe("setSettings", function()
	it("should have settings", function()
		expect(abbreviate._suffixTable).toEqual(expect.any("table"))
		expect(abbreviate._decimalPlaces).toEqual(expect.any("number"))
		expect(abbreviate._stripTrailingZeroes).toEqual(expect.any("boolean"))
	end)

	it("should allow changeable decimal places", function()
		expect(function()
			abbreviate:setSetting("decimalPlaces", 4)
		end).never.toThrow()
		expect(abbreviate._decimalPlaces).toBe(4)
	end)

	it("should allow changeable suffix table", function()
		local newSuffixTable = { "k", "M", "B" }

		expect(function()
			abbreviate:setSetting("suffixTable", newSuffixTable)
		end).never.toThrow()
		expect(abbreviate._suffixTable).toEqual(newSuffixTable)
	end)

	it("should allow changeable strip trailing zeroes", function()
		expect(function()
			abbreviate:setSetting("stripTrailingZeroes", true)
		end).never.toThrow()
		expect(abbreviate._stripTrailingZeroes).toBe(true)
	end)
end)

realDescribe("numberToString", function()
	it("should reject non-numbers", function()
		expect(function()
			abbreviate:numberToString("dog")
		end).toThrow()
	end)

	it("should work with negative numbers (0 > x > -1000)", function()
		expect(abbreviate:numberToString(-10)).toBe("-10.00")
		expect(abbreviate:numberToString(-0.05)).toBe("-0.05")
		-- test rounding of negative numbers
		expect(abbreviate:numberToString(-0.099)).toBe("-0.10")
	end)

	it("should work with negative numbers (-1000 > x)", function()
		expect(abbreviate:numberToString(-1000)).toBe("-1.00k")
		-- test rounding
		expect(abbreviate:numberToString(-1005, false)).toBe("-1.01k")
		expect(abbreviate:numberToString(-1005, true)).toBe("-1.00k")
	end)

	it("should work with positive numbers (1000 > x > 0)", function()
		expect(abbreviate:numberToString(0)).toBe("0.00")

		-- todo: maybe change this behavior?
		expect(abbreviate:numberToString(999.999)).toBe("1000.00")
		expect(abbreviate:numberToString(999.99)).toBe("999.99")

		expect(abbreviate:numberToString(0.005)).toBe("0.01")
	end)

	it("should work with positive numbers (x > 1000)", function()
		expect(abbreviate:numberToString(1000)).toBe("1.00k")

		-- test roundDown
		expect(abbreviate:numberToString(1005, false)).toBe("1.01k")
		expect(abbreviate:numberToString(1004, false)).toBe("1.00k")

		expect(abbreviate:numberToString(1005)).toBe("1.00k")
		expect(abbreviate:numberToString(1004)).toBe("1.00k")
	end)

	it("should carry to next suffix when rounding up reaches 1000", function()
		expect(abbreviate:numberToString(999_995, false)).toBe("1.00M")
	end)

	it("should work with stripTrailingZeroes set to true", function()
		abbreviate:setSetting("stripTrailingZeroes", true)

		expect(abbreviate:numberToString(0)).toBe("0")
		expect(abbreviate:numberToString(0.01)).toBe("0.01")
		expect(abbreviate:numberToString(0.1)).toBe("0.1")
		expect(abbreviate:numberToString(0.12)).toBe("0.12")

		expect(abbreviate:numberToString(1000)).toBe("1k")
		expect(abbreviate:numberToString(1200)).toBe("1.2k")
		expect(abbreviate:numberToString(1230)).toBe("1.23k")
	end)
end)

realDescribe("stringToNumber", function()
	it("should reject non-strings", function()
		expect(function()
			abbreviate:stringToNumber(1000)
		end).toThrow()
	end)

	it("should reject non-number strings", function()
		expect(function()
			abbreviate:stringToNumber("dog")
		end).toThrow()
	end)

	it("should convert strings (1000 > x > -1000)", function()
		expect(abbreviate:stringToNumber("-999")).toBe(-999)
		expect(abbreviate:stringToNumber("-0.99k")).toBe(-990)
		expect(abbreviate:stringToNumber("-0.995k")).toBe(-995)

		expect(abbreviate:stringToNumber("0")).toBe(0)
		expect(abbreviate:stringToNumber("0.05k")).toBe(50)
	end)

	it("should convert strings (-1000 > x", function()
		expect(abbreviate:stringToNumber("-1.00k")).toBe(-1000)
		expect(abbreviate:stringToNumber("-999.99M")).toBe(-999990000)
	end)

	it("should convert strings (x > 1000)", function()
		expect(abbreviate:stringToNumber("1.00k")).toBe(1000)
		expect(abbreviate:stringToNumber("999.99M")).toBe(999990000)
	end)
end)

realDescribe("commify", function()
	it("should reject non-numbers", function()
		expect(function()
			abbreviate:commify("dog")
		end).toThrow()
	end)

	it("should work with negative", function()
		expect(abbreviate:commify(-1000)).toBe("-1,000")
		expect(abbreviate:commify(-1000000)).toBe("-1,000,000")

		expect(abbreviate:commify(-10000)).toBe("-10,000")
	end)

	it("should work with positive", function()
		expect(abbreviate:commify(1000)).toBe("1,000")
		expect(abbreviate:commify(1000000)).toBe("1,000,000")

		expect(abbreviate:commify(10000)).toBe("10,000")
	end)

	it("shouldn't commify non-thousand values", function()
		expect(abbreviate:commify(-999)).toBe("-999")
		expect(abbreviate:commify(999)).toBe("999")
	end)
end)
