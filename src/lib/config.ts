import { writable } from 'svelte/store';

export const configStore = writable({
	worldDebug: true,
	axes: false,
	orbitControls: true,
	shadowLight: false,
	floorGrid: false,
	verticalView: false,
	floorColor: '#262626',
	mazeColor: '#04a8b4'
});
