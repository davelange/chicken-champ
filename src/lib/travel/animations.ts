import type { Vector } from '@dimforge/rapier3d-compat';
import type {
	Axis,
	BaseTravelAnimationOptions,
	PartialPoint,
	TravelActions,
	TravelAnimationOptions
} from './types';
import type { Easing } from '../easing';
import { MathUtils, Quaternion } from 'three';
import {
	getEasing,
	getFullEasing,
	getRotationStep,
	getTargetRotation,
	getTranslationForce
} from './utils';
import type { Travel } from '.';

export class TravelAnimation {
	type: 'translate' | 'rotate' | undefined;
	frame = 1;
	id: string;
	name: string;
	delay: number;
	loop: boolean;
	duration: number;
	originalOptions: BaseTravelAnimationOptions;
	onEnd?: () => void;

	removeSelf: (id: string) => void;
	addSelf: (options: BaseTravelAnimationOptions) => Travel;

	constructor(options: BaseTravelAnimationOptions, parent: TravelActions) {
		this.id = MathUtils.generateUUID();
		this.name = options.name || '';
		this.delay = options.delay || 0;
		this.loop = options.loop || false;
		this.duration = options.duration;
		this.onEnd = options.onEnd;

		this.originalOptions = { ...options, delay: 0 };
		this.removeSelf = parent.remove;
		this.addSelf = parent.add;
	}

	get progressAsDecimal() {
		return (this.frame * 100) / this.duration / 100;
	}

	incFrame() {
		if (this.frame === this.duration) {
			this.onEnd?.();
			this.removeSelf(this.id);

			if (this.loop) {
				this.addSelf(this.originalOptions);
			}
		}

		this.frame++;
	}

	applyFrame(type: Vector | Quaternion) {
		return type;
	}

	handle<T extends Vector | Quaternion>({ apply, value }: { apply: boolean; value: T }) {
		if (this.delay) {
			this.delay--;

			return { value, apply };
		}

		value = this.applyFrame(value) as T;
		this.incFrame();

		return { value, apply: true };
	}
}

export class TravelTranslate extends TravelAnimation {
	force: PartialPoint;
	acc: Axes<number>;
	easing: Partial<Axes<Easing>>;

	constructor(options: TravelAnimationOptions<'translate'>, parent: TravelActions) {
		super(options, parent);

		this.type = 'translate';
		this.easing = getFullEasing(options);
		this.acc = { x: 0, y: 0, z: 0 };
		this.force = getTranslationForce(options, parent.body.worldCom());
	}

	get axes() {
		return Object.keys(this.force) as Axis[];
	}

	applyFrame<T extends Vector>(position: T) {
		for (const axis of this.axes) {
			const { total, frameEase } = getEasing(
				this.easing[axis]!,
				this.progressAsDecimal,
				this.acc[axis]
			);
			this.acc[axis] = total;

			position[axis] += frameEase * (this.force?.[axis] || 0);
		}

		return position;
	}
}

export class TravelRotate extends TravelAnimation {
	target: Quaternion;
	rotationStep: number;
	acc = 0;
	easing: Easing;

	constructor(options: TravelAnimationOptions<'rotate'>, parent: TravelActions) {
		super(options, parent);

		this.type = 'rotate';
		this.target = getTargetRotation(options, parent.body.rotation());
		this.easing = options.easing;
		this.rotationStep = getRotationStep(options);
	}

	applyFrame(rotation: Quaternion) {
		const { total, frameEase } = getEasing(this.easing, this.progressAsDecimal, this.acc);
		this.acc = total;

		rotation.rotateTowards(this.target, frameEase * this.rotationStep);

		return rotation;
	}
}
