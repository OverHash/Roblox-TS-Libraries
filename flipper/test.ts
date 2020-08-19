import * as Flipper from "./";
import { onStepHandler } from './BaseMotor';
import { onCompleteHandler } from './BaseMotor';


// SINGLE MOTOR
// SUCCESSFUL
new Flipper.SingleMotor(0.5);
new Flipper.SingleMotor(0.5, true);

// FAIL
/* new Flipper.SingleMotor("hello");
new Flipper.SingleMotor(0.5, "hello"); */

// GROUP MOTOR
// SUCCESSFUL
new Flipper.GroupMotor({
	x: 0.5,
	y: 0.5,
});
new Flipper.GroupMotor(
	{
		x: 0.5,
		y: 0.5,
	},
	true,
);
new Flipper.GroupMotor({
	x: 0.5,
	y: 0.5,
}).getValue().x;

// FAIL
/* new Flipper.GroupMotor(0);
new Flipper.GroupMotor({
	x: 0.5,
	y: "hello",
});
new Flipper.GroupMotor({
	x: 0.5,
	y: 0.5,
	z: {
		w: "hello",
	},
});
new Flipper.GroupMotor({
	x: 0.5,
}).getValue().y; */

// SUCCESS
new Flipper.GroupMotor<{ x: number }>({ x: 0.5 }).setGoal(new Flipper.Instant({ x: 0.7 }));

// FAIL
/* new Flipper.GroupMotor<{ x: number }>({ x: 0.5 }).setGoal(new Flipper.Instant({ y: 0.5 })); */
