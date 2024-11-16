import GUI from 'lil-gui';
import { getContext, setContext } from 'svelte';
import { addDirectionalLight } from './gui';

export let gui = new GUI();

export class Config {
	values = $state({
		worldDebug: false,
		axes: false,
		orbitControls: true,
		shadowLight: false,
		floorGrid: false,
		verticalView: false,
		floorColor: '#dedede',
		mazeColor: '#333dc7',

		lights: {
			directionalLight1: {
				position: {
					x: 3,
					y: 20,
					z: -4
				},
				rotation: {
					x: 0,
					y: 0,
					z: 0
				},
				intensity: 2
			},
			directionalLight2: {
				position: {
					x: -3,
					y: 20,
					z: 0
				},
				rotation: {
					x: 0,
					y: 0,
					z: 0
				},
				intensity: 1
			}
		}
	});

	constructor() {
		this.loadFromLocal();

		$effect(() => {
			let state = JSON.stringify(this.values);
			localStorage.setItem('cc_config', state);
		});

		this.addToGUI();
	}

	addToGUI() {
		let debug = gui.addFolder('Debug');
		debug.add(this.values, 'worldDebug');
		debug.add(this.values, 'axes');
		debug.add(this.values, 'orbitControls');
		debug.add(this.values, 'floorGrid');
		debug.close();

		let cameraGroup = gui.addFolder('Camera');
		cameraGroup.add(this.values, 'verticalView');
		cameraGroup.close();

		let colors = gui.addFolder('Colors');
		colors.addColor(this.values, 'floorColor');
		colors.addColor(this.values, 'mazeColor');
		colors.close();

		addDirectionalLight({ gui, params: this.values.lights.directionalLight1, name: 'Light 1' });
		addDirectionalLight({ gui, params: this.values.lights.directionalLight2, name: 'Light 2' });

		gui.show();
	}

	loadFromLocal() {
		const local = localStorage.getItem('cc_config');

		if (local) {
			//	this.values = { ...this.values, ...(JSON.parse(local) as Config['values']) };
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
