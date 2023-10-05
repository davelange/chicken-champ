import type { Axes } from '$lib/animer';
import { Easing } from '$lib/easing';

export const avatarConfigs = {
	heavy: {
		moveBy: 3.5,
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
