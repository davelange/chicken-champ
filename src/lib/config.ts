import { writable } from 'svelte/store';

export const configStore = writable({
	worldDebug: false,
	axes: false,
	orbitControls: true,
	shadowLight: false,
	floorGrid: false,
	verticalView: false,
	avatarConfig: 'light' as 'heavy' | 'light'
});
