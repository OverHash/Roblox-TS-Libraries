import { connection } from "./connection";
import { BaseSpring } from "./BaseSpring";

export type onStepHandler = (newState: number) => void;
export type onCompleteHandler = () => void;

export class BaseMotor<T> {
	private initialValue;
	/**
	 * Creates the motor given an initial value
	 *
	 * To start the motor, you will need to call `start`
	 * @param initialValue The initial value for the spring
	 * @param shouldStartImplicitly If the motor should start automatically. Defaults to true.
	 */
	public constructor(initialValue: T, shouldStartImplicitly?: boolean);

	/**
	 * Manually steps the motor by a certain time step. You shouldn't need to call this in conventional usage.
	 * @param deltaTime The amount of time to step forward by
	 * @returns If the motor completed after this step
	 */
	public step(deltaTime: number): boolean;

	/**
	 * Gets the current state of the motor
	 * @returns The current state of the motor
	 */
	public getValue(): T;

	/**
	 * Sets the goal of a motor
	 * @param goal The new goal for the motor to go towards
	 */
	public setGoal(goal: BaseSpring<T>): void;

	/**
	 * Connects a callback that will be called with the motor's new value(s) whenever the motor updates. Returns a connection that can be used to disconnect the callback from the motor.
	 * @param handler The callback function for when the motor updates.
	 * @returns A connection that can be used to disconnect from updates
	 */
	public onStep(handler: onStepHandler): connection;

	/**
	 * Connects a callback that will be called with the motor's current value(s) when it has reached all of its goals. Returns a connection that can be used to disconnect the callback from the motor.
	 * @param handler The callback function for when the motor completes.
	 */
	public onComplete(handler: onCompleteHandler): connection;

	/**
	 * Starts a motor, moving in real time to it's target until it reaches it
	 *
	 * If `shouldStartImplicitly` was enabled in the construction of the motor, this doesn't need to be called after creation.
	 */
	public start(): void;

	/**
	 * Stops a motor where it is
	 */
	public stop(): void;

	/**
	 * Alias for `stop`
	 */
	public destroy(): void;
}
