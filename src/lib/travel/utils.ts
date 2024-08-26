import { Euler, Quaternion, Vector3 } from 'three';
import { allEases, type Easing } from '../easing';
import type { PartialPoint, TravelAnimationOptions } from './types';
import type { Rotation, Vector } from '@dimforge/rapier3d-compat';

export function getEasing(easing: Easing, t: number, acc: number) {
	const total = allEases[easing](t);
	const frameEase = total - acc;

	return { total, frameEase };
}

export const vectorAsAxis = {
	x: new Vector3(1, 0, 0).normalize(),
	y: new Vector3(0, 1, 0).normalize(),
	z: new Vector3(0, 0, 1).normalize()
};

export function getFullEasing(options: TravelAnimationOptions<'translate'>): Partial<Axes<Easing>> {
	if (typeof options.easing === 'object') {
		return options.easing;
	}

	return {
		x: options.easing,
		y: options.easing,
		z: options.easing
	};
}

export function getTranslationForce(
	options: TravelAnimationOptions<'translate'>,
	position: Vector
) {
	if (options.by) {
		return options.by;
	}

	const res = {} as PartialPoint;

	if (options.to) {
		let key: keyof typeof options.to;
		for (key in options.to) {
			res[key] = (position[key] - options.to[key]!) * -1;
		}
	}

	return res;
}

export function getTargetRotation(options: TravelAnimationOptions<'rotate'>, current: Rotation) {
	if (options.to) {
		return new Quaternion().setFromEuler(
			new Euler(options?.to?.x, options?.to?.y, options?.to?.z, 'XYZ')
		);
	}

	const { x, y, z, w } = current;
	const targetEuler = new Quaternion().setFromEuler(
		new Euler(options?.by?.x, options?.by?.y, options?.by?.z, 'XYZ')
	);

	return targetEuler.multiply(new Quaternion(x, y, z, w));
}

export function getRotationStep(options: TravelAnimationOptions<'rotate'>) {
	return Math.max(
		...Object.values(options?.to || options?.by || {}).map((v) => (v < 0 ? v * -1 : v))
	);
}
