import type { TravelAnimationOptions } from '$lib/travel/types';

type MotionOptions = { force: Partial<Axes<number>>; onEnd: () => void };

export const FALL_THRESHOLD = 0.3;
export const avatarConfigs = {
	heavy: {
		moveBy: 4,
		angularDamping: 3,
		gravityScale: 4,
		contactForceEventThreshold: 1,
		restitution: 0.1,
		getWalkMotion: ({ force, onEnd }: MotionOptions): TravelAnimationOptions<'translate'>[] => [
			{
				name: 'walkXZ',
				by: force,
				duration: 30,
				easing: { x: 'cubicOut', z: 'cubicOut' },
				onEnd
			},
			{
				name: 'walkY',
				to: { y: 3.2 },
				duration: 20,
				easing: 'cubicOut'
			}
		]
	},
	light: {
		moveBy: 4,
		angularDamping: 0.3,
		gravityScale: 4,
		restitution: 0.2,
		contactForceEventThreshold: 1,
		getWalkMotion: ({ force, onEnd }: MotionOptions): TravelAnimationOptions<'translate'>[] => [
			{
				name: 'walkXZ',
				by: force,
				duration: 20,
				easing: 'sineOut',
				onEnd
			},
			{
				name: 'walkY',
				to: { y: 3.2 },
				duration: 12,
				easing: 'circOut'
			}
		]
	}
};
