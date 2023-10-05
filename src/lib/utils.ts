import { Quaternion } from '@dimforge/rapier3d-compat';
import type { Axes } from '../types';

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
