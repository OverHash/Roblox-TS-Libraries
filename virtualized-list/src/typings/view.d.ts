import Roact from "@rbxts/roact";
import { GestureResponderEvent } from "./unimplemented";

/**
 * //FIXME: need to find documentation on which component is a TTouchable and can implement that interface
 * @see React.DOMAtributes
 */
export interface Touchable {
    onTouchStart?: ((event: GestureResponderEvent) => void) | undefined;
    onTouchMove?: ((event: GestureResponderEvent) => void) | undefined;
    onTouchEnd?: ((event: GestureResponderEvent) => void) | undefined;
    onTouchCancel?: ((event: GestureResponderEvent) => void) | undefined;
    onTouchEndCapture?: ((event: GestureResponderEvent) => void) | undefined;
}

/**
 * Gesture recognition on mobile devices is much more complicated than web.
 * A touch can go through several phases as the app determines what the user's intention is.
 * For example, the app needs to determine if the touch is scrolling, sliding on a widget, or tapping.
 * This can even change during the duration of a touch. There can also be multiple simultaneous touches.
 *
 * The touch responder system is needed to allow components to negotiate these touch interactions
 * without any additional knowledge about their parent or child components.
 * This system is implemented in ResponderEventPlugin.js, which contains further details and documentation.
 *
 * Best Practices
 * Users can feel huge differences in the usability of web apps vs. native, and this is one of the big causes.
 * Every action should have the following attributes:
 *      Feedback/highlighting- show the user what is handling their touch, and what will happen when they release the gesture
 *      Cancel-ability- when making an action, the user should be able to abort it mid-touch by dragging their finger away
 *
 * These features make users more comfortable while using an app,
 * because it allows people to experiment and interact without fear of making mistakes.
 *
 * TouchableHighlight and Touchable*
 * The responder system can be complicated to use.
 * So we have provided an abstract Touchable implementation for things that should be "tappable".
 * This uses the responder system and allows you to easily configure tap interactions declaratively.
 * Use TouchableHighlight anywhere where you would use a button or link on web.
 */
export interface GestureResponderHandlers {
    /**
     * A view can become the touch responder by implementing the correct negotiation methods.
     * There are two methods to ask the view if it wants to become responder:
     */

    /**
     * Does this view want to become responder on the start of a touch?
     */
    onStartShouldSetResponder?: ((event: GestureResponderEvent) => boolean) | undefined;

    /**
     * The View is now responding for touch events.
     * This is the time to highlight and show the user what is happening
     */
    onResponderGrant?: ((event: GestureResponderEvent) => void) | undefined;

    /**
     * Something else is the responder right now and will not release it
     */
    onResponderReject?: ((event: GestureResponderEvent) => void) | undefined;

    /**
     * If the view is responding, the following handlers can be called:
     */

    /**
     * Fired at the end of the touch, ie "touchUp"
     */
    onResponderRelease?: ((event: GestureResponderEvent) => void) | undefined;

    /**
     *  Something else wants to become responder.
     *  Should this view release the responder? Returning true allows release
     */
    onResponderTerminationRequest?: ((event: GestureResponderEvent) => boolean) | undefined;

    /**
     * onStartShouldSetResponder and onMoveShouldSetResponder are called with a bubbling pattern,
     * where the deepest node is called first.
     * That means that the deepest component will become responder when multiple Views return true for *ShouldSetResponder handlers.
     * This is desirable in most cases, because it makes sure all controls and buttons are usable.
     *
     * However, sometimes a parent will want to make sure that it becomes responder.
     * This can be handled by using the capture phase.
     * Before the responder system bubbles up from the deepest component,
     * it will do a capture phase, firing on*ShouldSetResponderCapture.
     * So if a parent View wants to prevent the child from becoming responder on a touch start,
     * it should have a onStartShouldSetResponderCapture handler which returns true.
     */
    onStartShouldSetResponderCapture?: ((event: GestureResponderEvent) => boolean) | undefined;
}

/**
 * @see https://reactnative.dev/docs/view#props
 */
export interface ViewProps
    extends GestureResponderHandlers, Touchable
{
    children?: Roact.Children;

    /**
     * Invoked on mount and layout changes with
     *
     * {nativeEvent: { layout: {x, y, width, height}}}.
     */
    onLayout?: ((event: InputObject) => void) | undefined;

    /**
     * This is a special performance property exposed by RCTView and is useful for scrolling content when there are many subviews,
     * most of which are offscreen. For this property to be effective, it must be applied to a view that contains many subviews that extend outside its bound.
     * The subviews must also have overflow: hidden, as should the containing view (or one of its superviews).
     */
    removeClippedSubviews?: boolean | undefined;

    style?: unknown | undefined; // OverHash deviation: TODO, implement StyleProp<ViewStyle>
}

/**
 * The most fundamental component for building UI, View is a container that supports layout with flexbox, style, some touch handling,
 * and accessibility controls, and is designed to be nested inside other views and to have 0 to many children of any type.
 * View maps directly to the native view equivalent on whatever platform React is running on,
 * whether that is a UIView, <div>, android.view, etc.
 */
declare class ViewComponent extends Roact.Component<ViewProps> {
	public render(): Roact.Element | undefined; // OverHash deviation
}
declare const ViewBase: typeof ViewComponent;

export class View extends ViewBase {}
