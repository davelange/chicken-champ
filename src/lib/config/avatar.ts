import { Easing } from '$lib/easing';

type MotionOptions = { force: Partial<Axes<number>>; onEnd: () => void };

const getResetMotion = ({ onEnd }: { onEnd: () => void }) => [
	{
		force: { y: 10 },
		duration: 40,
		easing: { y: Easing.OutQuint },
		next: {
			force: { y: -9 },
			duration: 40,
			easing: { y: Easing.OutCubic },
			onEnd
		}
	}
];

export const FALL_THRESHOLD = 0.3;
export const avatarConfigs = {
	heavy: {
		moveBy: 4,
		angularDamping: 3,
		gravityScale: 4,
		contactForceEventThreshold: 1,
		restitution: 0.1,
		getWalkMotion: ({ force, onEnd }: MotionOptions) => [
			{
				name: 'walkXZ',
				force,
				duration: 30,
				easing: { x: Easing.OutCubic, z: Easing.OutCubic },
				onEnd
			},
			{
				name: 'walkY',
				force: { y: 1.5 },
				duration: 20,
				easing: { y: Easing.OutCubic }
			}
		],
		getResetMotion
	},
	light: {
		moveBy: 4,
		angularDamping: 0.3,
		gravityScale: 4,
		restitution: 0.2,
		contactForceEventThreshold: 1,
		getWalkMotion: ({ force, onEnd }: MotionOptions) => [
			{
				name: 'walkXZ',
				force,
				duration: 20,
				easing: { x: Easing.OutSine, z: Easing.OutSine },
				onEnd
			},
			{
				name: 'walkY',
				force: { y: 1.5 },
				duration: 12,
				easing: { y: Easing.OutCirc }
			}
		],
		getResetMotion
	}
};
