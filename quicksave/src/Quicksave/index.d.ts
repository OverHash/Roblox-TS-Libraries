import { t } from "@rbxts/t";
import { QuicksaveCollection } from "./Collection";

export type QuicksaveSchema = Record<string, t.check<unknown>>;

interface QuickSaveOptions<T extends QuicksaveSchema> {
	/**
	 * The schema to validate for data.
	 */
	schema: T;
	/**
	 * The default data when creating a document.
	 */
	defaultData: { [P in keyof T]: t.static<T[P]> };

	/**
	 * typings todo
	 */
	migrations?: object;
}

/**
 * Creates a new collection.
 * @param name The name of the collection to create.
 * @param options The options associated with the collection.
 */
export function createCollection<T extends QuicksaveSchema>(
	name: string,
	options: QuickSaveOptions<T>,
): QuicksaveCollection<T>;

/**
 * Retrieves a pre-created collection.
 * @param name The name of the collection to retrieve.
 */
export function getCollection<T extends QuicksaveSchema>(name: string): QuicksaveCollection<T>;
