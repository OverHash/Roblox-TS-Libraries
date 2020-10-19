type AllowedConstructors = Model | BasePart;

interface Module3D<T extends AllowedConstructors> extends ViewportFrame {
	/**
	 * The model for the bounding box. If the input model was a model, it will be the same as the input.
	 */
	Object3D: T;

	/**
	 * The frame the model is adorned to.
	 */
	AdornFrame: ViewportFrame;

	/**
	 * Force updates the camera CFrame.
	 */
	Update(): void;

	/**
	 * Sets the CFrame offset.
	 *
	 * Automatically updates the camera CFrame.
	 * @param newCF The new CFrame to update the Module3D to
	 */
	SetCFrame(newCF: CFrame): void;

	/**
	 * Returns the CFrame offset.
	 */
	GetCFrame(): CFrame;

	/**
	 * Sets the multiplier for how far back the camera should go.
	 *
	 * Automatically updates the camera CFrame.
	 * @param Multiplier How far back the camera should go.
	 */
	SetDepthMultiplier(Multiplier: number): void;

	/**
	 * Returns the depth multiplier
	 */
	GetDepthMultiplier(): number;
}

interface Module3DConstructor {
	/**
	 * Creates a Model3D object.
	 * @param model The model to base the Module3D object off.
	 */
	new <T extends AllowedConstructors>(model: T): Module3D<T>;

	/**
	 * Attaches a model **or** part to a frame. Returns a Model3D object.
	 *
	 * Does **not** use a clone of the model so it can be referenced directly.
	 * @param frame The frame to attach the model/part to
	 * @param model The object to attach to the frame
	 */
	Attach3D<T extends AllowedConstructors>(frame: Frame, model: T): Module3D<T>;
}
declare const Module3D: Module3DConstructor;

export = Module3D;
