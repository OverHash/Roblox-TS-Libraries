declare namespace tableutil {
	/**
	 * Creates and returns a deep copy of the given table.
	 * @param tbl The table to copy
	 */
	export function Copy<T extends Object>(tbl: T): T;

	/**
	 * Creates and returns a shallow copy of the given table.
	 * @param tbl The table to copy. **This only copies at a shallow level**
	 */
	export function CopyShallow<T extends Object>(tbl: T): T;
	
	/**
	 * Synchronizes a table to the template table. If the table does not have an item that exists within the template, it gets added. If the table has something that the template doesn't have, it gets removed.
	 * @param tbl The object to synchronise
	 * @param templateTbl The template object
	 */
	export function Sync<T extends Object>(tbl: Object, templateTbl: T): T;

	/**
	 * Shuffles the array. Internally, this is using the Fisher-Yates algorithm to shuffle around the items.
	 * @param tbl The array to shuffle
	 */
	export function Shuffle<T>(tbl: Array<T>): Array<T>;

	/**
	 * Returns `true` if the table is empty.
	 * @param tbl The table to check is empty
	 */
	export function IsEmpty(tbl: Object): boolean;
}

export = tableutil;