import { t } from "@rbxts/t";
import { QuicksaveSchema } from ".";
import { QuicksaveCollection } from "./Collection";

declare class QuicksaveDocument<T extends QuicksaveSchema> {
	/**
	 * The collection associated with this document.
	 */
	collection: QuicksaveCollection<T>;

	/**
	 * The name of the collection.
	 */
	name: string;

	/**
	 * Creates a promise which is resolved when the document is able to be used in game.
	 */
	readyPromise(): Promise<this>;

	/**
	 * Retrieves a member of the document.
	 * @param key The key of the document retrieve.
	 */
	get<K extends keyof T>(key: K): t.static<T[K]>;

	/**
	 * Sets a value to a key of the document.
	 * @param key The key to set in the document.
	 * @param value The value to set.
	 */
	set<K extends keyof T>(key: K, value: t.static<T[K]>): void;

	/**
	 * Saves the document.
	 */
	save(): Promise<void>;

	/**
	 * Closes the document.
	 */
	close(): Promise<void>;

	/**
	 * Checks if the document is closed.
	 */
	isClosed(): boolean;
}
