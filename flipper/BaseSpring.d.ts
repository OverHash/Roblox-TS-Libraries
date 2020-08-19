export class BaseSpring<T> {
	/**
	 * @param targetValue The new target values for the spring
	 * @param options The options when animating this spring
	 */
	constructor(
		targetValue: T,
		options?: {
			frequency?: number;
			dampingRatio?: number;
		},
	);

	private targetValue: T;
}
