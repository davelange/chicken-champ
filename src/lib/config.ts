import { writable } from 'svelte/store';

export const configStore = writable({
	worldDebug: false,
	axes: false,
	orbitControls: true,
	shadowLight: false,
	floorGrid: false,
	verticalView: false,
	floorColor: '#262626', //'#2d3839',
	mazeColor: '#04a8b4'
});

export function initConfig() {
	const local = localStorage.getItem('config');

	if (local) {
		configStore.set(JSON.parse(local));
	}

	configStore.subscribe((st) => {
		localStorage.setItem('config', JSON.stringify(st));
	});
}
