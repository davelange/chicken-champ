import { getContext, setContext } from 'svelte';

export class Config {
	values = $state({
		worldDebug: false,
		axes: false,
		orbitControls: true,
		shadowLight: false,
		floorGrid: false,
		verticalView: false,
		floorColor: '#262626',
		mazeColor: '#04a8b4'
	});

	constructor() {
		this.loadFromLocal();

		$effect(() => {
			let state = JSON.stringify(this.values);
			localStorage.setItem('config', state);
		});
	}

	loadFromLocal() {
		const local = localStorage.getItem('config');

		if (local) {
			this.values = JSON.parse(local) as Config['values'];
		}
	}
}

const CONTEXT_KEY = Symbol('config');

export function initConfig() {
	let config = new Config();
	return setContext(CONTEXT_KEY, config);
}

export function getConfig() {
	return getContext<ReturnType<typeof initConfig>>(CONTEXT_KEY).values;
}
