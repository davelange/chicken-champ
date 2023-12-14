type Triplet = [x: number, y: number, z: number];

type Axis = 'x' | 'y' | 'z';

type Axes<T> = {
	x: T;
	y: T;
	z: T;
};

type Orientation = 'xPos' | 'xNeg' | 'zNeg' | 'zPos';

type AvatarPhysicalState = 'crouch' | 'idle';

type MazeBlock = {
	position: Triplet;
	dimension: Triplet;
	color?: string;
};
