declare class RotatedRegion3 {
	/**
	 * CFrame that represents the center of the region
	 */
	public readonly CFrame: CFrame;
	/**
	 * vector3 that represents the size of the region
	 */
	public readonly Size: Vector3;
	/**
	 * string that represents the shape type of the RotatedRegion3 object
	 */
	public readonly Shape: "Block" | "Wedge" | "CornerWedge" | "Cylinder" | "Ball";
	/**
	 * array of vector3 that are passed to the support function
	 */
	public readonly Set: Array<Vector3>;
	/**
	 * function that is used for support in the GJK algorithm
	 */
	public readonly Support: Function;
	/**
	 * vector3 that represents the center of the set, again used for the GJK algorithm
	 */
	public readonly Centroid: Vector3;
	/**
	 * standard region3 that represents the world bounding box of the RotatedRegion3 object
	 */
	public readonly AlignedRegion3: Region3;

	/**
	 * Creates a region from a cframe which acts as the center of the region and size which extends to the corners like a block part.
	 * @param cframe The central point of the region3
	 * @param size The size of the region3
	 */
	constructor(cframe: CFrame, size: Vector3);

	/**
	 * This is the exact same as the region.new constructor, but has a different name.
	 * @param cframe The central point of the region3
	 * @param size The size of the region3
	 */
	static Block: (cframe: CFrame, size: Vector3) => RotatedRegion3;

	/**
	 * Creates a region from a cframe which acts as the center of the region and size which extends to the corners like a wedge part.
	 * @param cframe The central point of the region3
	 * @param size The size of the region3
	 */
	static Wedge: (cframe: CFrame, size: Vector3) => RotatedRegion3;

	/**
	 * Creates a region from a cframe which acts as the center of the region and size which extends to the corners like a cornerWedge part.
	 * @param cframe The central point of the region3
	 * @param size The size of the region3
	 */
	static CornerWedge: (cframe: CFrame, size: Vector3) => RotatedRegion3;

	/**
	 * Creates a region from a cframe which acts as the center of the region and size which extends to the corners like a cylinder part.
	 * @param cframe The central point of the region3
	 * @param size The size of the region3
	 */
	static Cylinder: (cframe: CFrame, size: Vector3) => RotatedRegion3;

	/**
	 * Creates a region from a cframe which acts as the center of the region and size which extends to the corners like a ball part.
	 * @param cframe The central point of the region3
	 * @param size The size of the region3
	 */
	static Ball: (cframe: CFrame, size: Vector3) => RotatedRegion3;

	/**
	 * Creates a region from a part in the game. It can be used on any base part, but the region will treat unknown shapes (meshes, unions, etc) as block shapes.
	 * @param part The part to create a Region3 from
	 */
	static FromPart: (part: BasePart) => RotatedRegion3;

	/**
	 * Checks if a point is within the RotatedRegion3 object
	 * @param point the point to check is within the RotatedRegion3 object
	 * @returns true or false if the point is within the RotatedRegion3 object
	 */
	CastPoint(point: Vector3): boolean;

	/**
	 * Checks if a part is within the RotatedRegion3 object
	 * @param part the part to check is within the RotatedRegion3 object
	 * @returns true or false if the point is within the RotatedRegion3 object
	 */
	CastPart(part: BasePart): boolean;

	/**
	 * Finds any parts inside the Region3, up to a limit
	 * @param ignore parts that either are descendants of or actually are the ignore instance will be ignored
	 * @param maxParts a maximum number of parts in array. the default is 20
	 * @returns array of parts in the RotatedRegion3 object
	 */
	FindPartsInRegion3(ignore?: Instance, maxParts?: number): Array<Part>;

	/**
	 * Finds any parts inside the Region3, up to a limit, with a ignore list
	 * @param ignore parts that either are descendants of the ignore array or actually are the ignore array instances will be ignored
	 * @param maxParts a maximum number of parts in the return array. the default is 20
	 * @returns array of parts in the RotatedRegion3 object
	 */
	FindPartsInRegion3WithIgnoreList(ignore: Array<Instance>, maxParts?: number): Array<Part>;

	/**
	 * Finds any parts inside the Region3, up to a limit, with a ignore list
	 * @param whiteList parts that either are descendants of the whiteList array or actually are the whiteList array instances are all that will be checked
	 * @param maxParts a maximum number of parts in the return array. the default is 20
	 * @returns array of parts in the RotatedRegion3 object
	 */
	FindPartsInRegion3WithWhiteList(whiteList: Array<Instance>, maxParts?: number): Array<Part>;

	/**
	 * Same as the `.FindPartsInRegion3WithIgnoreList` method, but will check if the ignore argument is an array or single instance
	 * @param ignore An instance or array to ignore in the search, descendants included
	 * @param maxParts a maximum number of parts in the return array. the default is 20
	 */
	Cast(ignore: Instance | Array<Instance>, maxParts?: number): Array<Part>;
}

export = RotatedRegion3;
