export type Triplet = [x: number, y: number, z: number];

export type Axis = 'x' | 'y' | 'z';

export type Axes<T> = {
	x: T;
	y: T;
	z: T;
};

export type Orientation = 'xPos' | 'xNeg' | 'zNeg' | 'zPos';

export type AvatarPhysicalState = 'crouch' | 'idle';
