import { Easing } from '$lib/easing';
import type { Axes } from '../../types';

export const avatarConfigs = {
	heavy: {
		moveBy: 4,
		angularDamping: 3,
		gravityScale: 4,
		contactForceEventThreshold: 1,
		walkMotion: (force: Partial<Axes<number>>, onEnd: () => void) => [
			{
				name: 'walkXZ',
				force,
				duration: 40,
				easing: { x: Easing.OutCubic, z: Easing.OutCubic },
				onEnd
			},
			{
				name: 'walkY',
				force: { y: 1.5 },
				duration: 15,
				easing: { y: Easing.OutCubic }
			}
		]
	},
	light: {
		moveBy: 4.5,
		angularDamping: 0.5,
		gravityScale: 4,
		contactForceEventThreshold: 1,
		walkMotion: (force: Partial<Axes<number>>, onEnd: () => void) => [
			{
				name: 'walkXZ',
				force,
				duration: 28,
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
			force: { y: -10 },
			duration: 60,
			easing: { y: Easing.OutCubic },
			onEnd
		}
	}
];
