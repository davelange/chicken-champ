import { writable } from 'svelte/store';

export const configStore = writable({
	worldDebug: false,
	axes: false,
	orbitControls: false,
	shadowLight: false,
	floorGrid: false,
	verticalView: false,
	avatarConfig: 'light' as 'heavy' | 'light'
});
