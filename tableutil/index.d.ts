type RealObject = Record<string | number | symbol, defined> | ReadonlyArray<defined> | ReadonlyMap<defined, defined>;

declare namespace TableUtil {
	/**
	 * Performs a deep copy of the given table. In other words, all nested tables will also get copied.
	 *
	 * Use `Copy` if the entire table must be copied over. Otherwise, use `CopyShallow`.
	 *
	 * The `Copy` function does not handle cyclical tables. Passing a table with cyclical references to `Copy` will result in a stack-overflow.
	 * Copy can be used with objects, arrays, tuples, and maps.
	 * @param tbl The table to copy
	 * @returns A deep-copied version of the input.
	 *
	 * @example
	 * ```ts
	 * const tbl = ["a", "b", "c", ["d", "e", "f"]];
	 * const tblCopy = TableUtil.Copy(tbl);
	 *
	 * print(tblCopy); // {"a", "b", "c", {"d", "e", "f"}}
	 * print(tblCopy[3] == tbl[3]) // false
	 * ```
	 */
	export function Copy<T extends RealObject>(tbl: T): T;

	/**
	 * Performs a shallow copy of the given table. In other words, all nested tables will not be copied, but only re-referenced. Thus, a nested table in both the original and the copy will be the same.
	 *
	 * CopyShallow can be used with objects, arrays, tuples, and maps.
	 * @param tbl The table to copy. **This only copies at a shallow level**
	 * @returns A shallow copied version of the input.
	 * @example
	 *
	 * ```ts
	 * const tbl = ["a", "b", "c", ["d", "e", "f"]];
	 * const tblCopy = TableUtil.CopyShallow(tbl);
	 *
	 * print(tblCopy); // {"a", "b", "c", {"d", "e", "f"}}
	 * print(tblCopy[3] == tbl[3]) // true
	 * ```
	 */
	export function CopyShallow<T extends RealObject>(tbl: T): T;

	/**
	 * Synchronizes the `tbl` table based on `template` table.
	 * * If `tbl` is missing something from `template`, it is added.
	 * * If `tbl` has something that `template` does not, it is removed.
	 * * If `tbl` has a different data type than the item in `template`, overwrite with the template value instead.
	 *
	 * @example
	 * ```ts
	 * const template = {
	 * 	kills: 0,
	 * 	deaths: 0,
	 * 	points: 0,
	 * };
	 *
	 * const data = { kills: 10, deaths: "test", xp: 20 };
	 *
	 * const syncData = TableUtil.Sync(data, template);
	 * print(syncData) // {kills = 10, deaths = 0, points = 0}
	 * ```
	 *
	 * From the above example, `Sync` did the following: - Kept `kills` the same because it already exists and is of the same data type. - Overwrote `deaths` to the template value because of the mismatched data type. - Added `points` because it was missing. - Removed `xp` because it was not present in the template.
	 *
	 * Although not shown in the above example, `Sync` will properly handle nested tables; however, it will not handle cyclical tables. Cyclical tables given to `Sync` will throw a stack-overflow error.
	 *
	 * Sync can be used with objects, arrays, tuples, and maps.
	 * @param tbl The object to synchronize
	 * @param templateTbl The template object
	 * @returns A synchronized table, where the templateTbl is used for missing keys or keys of the wrong type, and tbl is the base table to synchronize.
	 */
	export function Sync<T extends RealObject, K extends RealObject>(tbl: T, templateTbl: K): T & K;

	/**
	 * Creates a reversed version of this table.
	 * @example
	 * ```ts
	 * const data = [1, 2, 3, 4, 5];
	 * const reversed = TableUtil.Reverse(data);
	 *
	 * print(reversed); // {5, 4, 3, 2, 1}
	 * ```
	 * Can only be used on arrays.
	 * @param tbl The table to reverse
	 * @returns The inputted table, but in reverse order.
	 */
	export function Reverse<T extends Array<defined>>(tbl: T): T;

	/**
	 * Creates a shallow copy of the given table and shuffles it using the [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) algorithm. If desired, a [Random](https://developer.roblox.com/en-us/api-reference/datatype/Random) object can be passed as a second argument to override the default RNG in TableUtil.
	 *
	 * @example
	 * ```ts
	 * const music = ["Song1", "Song2", "Song3", "Song4", "Song5"];
	 *
	 * const shuffledMusic = TableUtil.Shuffle(music);
	 *
	 * print(shuffledMusic); // e.g. {"Song4", "Song5", "Song2", "Song3", "Song1"}
	 * ```
	 *
	 * `Shuffle` can only be used with arrays and ReadonlyArray.
	 * @param tbl The array to shuffle
	 * @returns A shuffled version of the array
	 */
	export function Shuffle<T extends ReadonlyArray<defined>>(
		tbl: T,
		rng?: Random,
	): T extends ReadonlyArray<infer U> ? Array<U> : T;

	/**
	 * Returns `true` if the table is empty. The implementation for this is simply checking against the condition: `next(tbl) == nil`.
	 * @example
	 * ```ts
	 * const t1: Array<number> = [];
	 * const t2 = [32];
	 * const t3 = {num: 10};
	 *
	 * print("T1 empty", TableUtil.IsEmpty(t1)); // T1 empty: true
	 * print("T2 empty", TableUtil.IsEmpty(t2)); // T1 empty: false
	 * print("T2 empty", TableUtil.IsEmpty(t2)); // T1 empty: false
	 * ```
	 *
	 * `IsEmpty` can be used with objects, arrays, tuples, and maps.
	 * @param tbl The table to check is empty
	 * @returns If the table was empty.
	 */
	export function IsEmpty(tbl: RealObject): boolean;
}

export = TableUtil;
