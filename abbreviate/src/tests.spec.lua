return function()
	local abbreviate

	local function realDescribe(str, callback)
		beforeEach(function()
			abbreviate = require(script.Parent)()
		end)

		return describe(str, callback)
	end

	realDescribe("setSettings", function()
		it("should have settings", function()
			expect(abbreviate._suffixTable).to.be.a("table")
			expect(abbreviate._decimalPlaces).to.be.a("number")
		end)

		it("should allow changable decimal places", function()
			expect(function()
				abbreviate:setSetting("decimalPlaces", 4)
			end).to.never.throw()
			expect(abbreviate._decimalPlaces).to.equal(4)
		end)

		it("should allow changable suffix table", function()
			local newSuffixTable = {"k", "M", "B"}

			expect(function()
				abbreviate:setSetting("suffixTable", newSuffixTable)
			end).to.never.throw()
			expect(abbreviate._suffixTable).to.equal(newSuffixTable)
		end)
	end)

	realDescribe("numberToString", function()
		it("should reject non-numbers", function()
			expect(function()
				abbreviate:numberToString("dog")
			end).to.throw()
		end)

		it("should work with negative numbers (0 > x > -1000)", function()
			expect(abbreviate:numberToString(-10)).to.equal("-10.00")
			expect(abbreviate:numberToString(-0.05)).to.equal("-0.05")
			-- test rounding of negative numbers
			expect(abbreviate:numberToString(-0.099)).to.equal("-0.10")
		end)

		it("should work with negative numbers (-1000 > x", function()
			expect(abbreviate:numberToString(-1000)).to.equal("-1.00k")
			-- test rounding
			expect(abbreviate:numberToString(-1005, false)).to.equal("-1.01k")
			expect(abbreviate:numberToString(-1005, true)).to.equal("-1.00k")
		end)

		it("should work with positive numbers (1000 > x > 0)", function()
			expect(abbreviate:numberToString(0)).to.equal("0.00")

			-- todo: maybe change this behavior?
			expect(abbreviate:numberToString(999.999)).to.equal("1000.00")
			expect(abbreviate:numberToString(999.99)).to.equal("999.99")

			expect(abbreviate:numberToString(0.005)).to.equal("0.01")
		end)

		it("should work with positive numbers (x > 1000)", function()
			expect(abbreviate:numberToString(1000)).to.equal("1.00k")

			-- test roundDown
			expect(abbreviate:numberToString(1005, false)).to.equal("1.01k")
			expect(abbreviate:numberToString(1005)).to.equal("1.00k")
		end)
	end)

	realDescribe("stringToNumber", function()
		it("should reject non-strings", function()
			expect(function()
				abbreviate:stringToNumber(1000)
			end).to.throw()
		end)

		it("should reject non-number strings", function()
			expect(function()
				abbreviate:stringToNumber("dog")
			end).to.throw()
		end)

		it("should convert strings (1000 > x > -1000)", function()
			expect(abbreviate:stringToNumber("-999")).to.equal(-999)
			expect(abbreviate:stringToNumber("-0.99k")).to.equal(-990)
			expect(abbreviate:stringToNumber("-0.995k")).to.equal(-995)

			expect(abbreviate:stringToNumber("0")).to.equal(0)
			expect(abbreviate:stringToNumber("0.05k")).to.equal(50)
		end)

		it("should convert strings (-1000 > x", function()
			expect(abbreviate:stringToNumber("-1.00k")).to.equal(-1000)
			expect(abbreviate:stringToNumber("-999.99M")).to.equal(-999990000)
		end)

		it("should convert strings (x > 1000)", function()
			expect(abbreviate:stringToNumber("1.00k")).to.equal(1000)
			expect(abbreviate:stringToNumber("999.99M")).to.equal(999990000)
		end)
	end)

	realDescribe("commify", function()
		it("should reject non-numbers", function()
			expect(function()
				abbreviate:commify("dog")
			end).to.throw()
		end)

		it("should work with negative", function()
			expect(abbreviate:commify(-1000)).to.equal("-1,000")
			expect(abbreviate:commify(-1000000)).to.equal("-1,000,000")

			expect(abbreviate:commify(-10000)).to.equal("-10,000")
		end)

		it("should work with positive", function()
			expect(abbreviate:commify(1000)).to.equal("1,000")
			expect(abbreviate:commify(1000000)).to.equal("1,000,000")

			expect(abbreviate:commify(10000)).to.equal("10,000")
		end)

		it("shouldn't commify non-thousand values", function()
			expect(abbreviate:commify(-999)).to.equal("-999")
			expect(abbreviate:commify(999)).to.equal("999")
		end)
	end)
end
