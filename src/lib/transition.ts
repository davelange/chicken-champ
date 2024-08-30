import type { Easing } from './easing';
import { useTask } from '@threlte/core';
import { getEasing } from './travel/utils';

type Callback<T> = (ref: T) => {
	easing: Easing;
	duration: number;
	delay?: number;
	tick: (t: number) => void;
	onEnd: () => void;
};

export const createTransition = <T>(fn: Callback<T>) => {
	return ({ ref }: { ref: T }) => {
		let options = fn(ref);
		let currentFrame = 1;
		let acc = 0;

		const { stop } = useTask(() => {
			if (options.delay && options.delay > 0) {
				options.delay--;
			} else if (currentFrame <= options.duration) {
				let ease = getEasing(options.easing, currentFrame / options.duration, acc);
				currentFrame++;
				acc = ease.total;
				options.tick(ease.total);
			} else {
				options.onEnd();
				stop();
			}
		});
	};
};
