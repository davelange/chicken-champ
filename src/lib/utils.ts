import { Quaternion, Vector3, type Vector } from '@dimforge/rapier3d-compat';
import type { Color } from 'three';
import type { KeyMap } from './keyq';

export function getFromUrl(keys: string[], url: URL) {
	return keys.reduce(
		(memo, key) => ({
			...memo,
			[key]: url.searchParams.get(key) || ''
		}),
		{} as Record<string, string>
	);
}

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

export const FULL_ROTATION = Math.PI * 2;

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

export function randInRange(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

function hexToRgb(hex: string): number[] {
	// Convert hex to RGB
	const bigint = parseInt(hex.slice(1), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	return [r, g, b];
}

// Source: ChatGPT
export function interpolateColor(
	startColor: string,
	endColor: string
): (progress: number) => Color {
	const startColorRGB = hexToRgb(startColor);
	const endColorRGB = hexToRgb(endColor);

	return (progress: number) => {
		const interpolatedColor = startColorRGB.map((startValue, i) =>
			Math.round(startValue + (endColorRGB[i] - startValue) * progress)
		);

		const output =
			'#' +
			(
				(1 << 24) +
				(interpolatedColor[0] << 16) +
				(interpolatedColor[1] << 8) +
				interpolatedColor[2]
			)
				.toString(16)
				.slice(1);

		return output as unknown as Color;
	};
}

export function getForceFromKey(key: KeyMap, moveBy: number) {
	let direction = { x: 0, y: 0, z: 0 };

	if (key.w) {
		direction.z -= moveBy;
	} else if (key.a) {
		direction.x -= moveBy;
	} else if (key.d) {
		direction.x += moveBy;
	} else if (key.s) {
		direction.z += moveBy;
	}

	return direction;
}
