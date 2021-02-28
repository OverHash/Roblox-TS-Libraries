import { t } from "@rbxts/t";

import { QuicksaveSchema } from ".";
import { QuicksaveDocument } from "./Document";

declare class QuicksaveCollection<T extends QuicksaveSchema> {
	/**
	 * The name of the collection.
	 */
	name: string;

	/**
	 * The schema documents must adhere by in the collection.
	 */
	schema: T;

	/**
	 * The default data for documents which are created.
	 */
	defaultData: { [P in keyof T]: t.static<T[P]> };

	/**
	 * Retrieves a document.
	 * @param name The name of the document to retrieve
	 */
	getDocument(name: string): Promise<QuicksaveDocument<T>>;

	/**
	 * Gets the latest version from migrations.
	 */
	getLatestMigrationVersion(): number;

	/**
	 * Validates that data matches the schema
	 * @param data The data to validate
	 */
	validateData(data: unknown): data is { [P in keyof T]: t.static<T[P]> };

	/**
	 * Validates that a given key is a valid key of the document.
	 * @param key The key to check exists in data.
	 */
	keyExists(key: unknown): key is keyof T;

	/**
	 * Validates that a key/value pair matches the defined schema.
	 * @param key The key to validate.
	 * @param value The value to validate.
	 */
	validateKey(key: keyof T, value: unknown): value is t.static<T[typeof key]>;
}
