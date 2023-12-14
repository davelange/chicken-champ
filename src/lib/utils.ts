import { Quaternion, Vector3, type Vector } from '@dimforge/rapier3d-compat';

export function deepRound(n: number) {
	return Math.round(n * 1000000) / 1000000;
}

export function isElement(body: any, name: string) {
	return body.userData.name === name;
}

export const quaternion = {
	xPos: new Quaternion(0, 0, 0, 1),
	xNeg: new Quaternion(0, 1, 0, 0),
	zNeg: new Quaternion(0, 0.707, 0, 0.707),
	zPos: new Quaternion(0, -0.707, 0, 0.707)
};

export function getAdjustedRotation(currentRot: Quaternion, target: Orientation) {
	const base = quaternion[target];
	base.x = currentRot.x;
	base.z = currentRot.z;

	return base;
}

export function checkOrientation(
	data: Axes<number>,
	axis: keyof Axes<number>,
	compare: 'pos' | 'neg'
) {
	let sum = 0;
	const axisCompare = compare === 'neg' ? data[axis] < 0 : data[axis] > 0;

	for (const k in data) {
		if (k !== axis) sum += data[k as keyof typeof data];
	}

	return sum === 0 && axisCompare;
}

export function debounce(fn: (args: any) => void, delay: number) {
	let timeout: ReturnType<typeof setTimeout>;

	return (args: any) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(args), delay);
	};
}

export function snapToGrid(current: Vector, gridSize: number) {
	function findClosestDivisible(val: number, offset: number, by: number) {
		if (!Number.isInteger(val)) {
			return findClosestDivisible(Math.floor(val), offset, by);
		}
		if ((val + offset) % by === 0) {
			return val + offset;
		}

		if ((val - offset) % by === 0) {
			return val - offset;
		}

		return findClosestDivisible(val, offset + 1, by);
	}

	const x = findClosestDivisible(current.x, 0, gridSize);
	const z = findClosestDivisible(current.z, 0, gridSize);

	return new Vector3(x, current.y, z);
}

export function roundTo(number: number, decimalPlaces: number): number {
	const multiplier = Math.pow(10, decimalPlaces);
	return Math.round(number * multiplier) / multiplier;
}

export function anyExceeds(values: number[], limit: number) {
	return values.some((val) => Math.abs(val) > limit);
}

export function notNeg(value: number) {
	return value >= 0;
}

export function neg(value: number) {
	return value < 0;
}
