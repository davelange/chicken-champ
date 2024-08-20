import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';

export class Config {
	worldDebug = $state(false);
	axes = $state(false);
	orbitControls = $state(true);
	shadowLight = $state(false);
	floorGrid = $state(false);
	verticalView = $state(false);
	floorColor = $state('#262626');
	mazeColor = $state('#04a8b4');

	constructor() {
		this.loadFromLocal();

		$effect(() => {
			localStorage.setItem('config', JSON.stringify(this));
		});
	}

	loadFromLocal() {
		if (!browser) {
			return;
		}

		const local = localStorage.getItem('config');

		if (local) {
			const parsed = JSON.parse(local) as Config;
			Object.assign(this, parsed);
		}
	}
}

const CONTEXT_KEY = Symbol('config');

export function initConfig() {
	return setContext(CONTEXT_KEY, new Config());
}

export function getConfig() {
	return getContext<ReturnType<typeof initConfig>>(CONTEXT_KEY);
}
