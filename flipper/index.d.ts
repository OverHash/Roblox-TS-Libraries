import { BaseSpring } from "./BaseSpring";
import { BaseMotor } from "./BaseMotor";

export class SingleMotor extends BaseMotor<number> {}
export class GroupMotor<T extends { [index: string]: number }> extends BaseMotor<T> {}

export class Instant<T> extends BaseSpring<T> {}
export class Spring<T> extends BaseSpring<T> {}

export function isMotor<T extends { [index: string]: number } | number = number>(value: unknown): value is BaseMotor<T>;
