import { Easing } from '$lib/easing';
import type { Axes } from '../../types';

export const FALL_THRESHOLD = 0.3;
export const avatarConfigs = {
	heavy: {
		moveBy: 4,
		angularDamping: 3,
		gravityScale: 4,
		contactForceEventThreshold: 1,
		restitution: 0.1,
		walkMotion: (force: Partial<Axes<number>>, onEnd: () => void) => [
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
		]
	},
	light: {
		moveBy: 4,
		angularDamping: 0.4,
		gravityScale: 4,
		restitution: 0.3,
		contactForceEventThreshold: 1,
		walkMotion: (force: Partial<Axes<number>>, onEnd: () => void) => [
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
		]
	}
};

export const resetMotion = ({ onEnd }: { onEnd: () => void }) => [
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
