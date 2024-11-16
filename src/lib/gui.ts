import type GUI from 'lil-gui';
import { DirectionalLight } from 'three';
import type { getConfig } from './config.svelte';

export function addDirectionalLight({
	gui,
	params,
	name
}: {
	gui: GUI;
	name: string;
	params: ReturnType<typeof getConfig>['lights']['directionalLight1'];
}) {
	let group = gui.addFolder(name);

	const defaultParams = {
		position: {
			x: 3,
			y: 20,
			z: -4
		},
		rotation: {
			x: 3,
			y: 20,
			z: -4
		},
		intensity: 2
	};

	const merged = {
		...defaultParams,
		...params
	};

	// position
	group.add(merged.position, 'x').name('Position x').min(-100).max(70);
	group.add(merged.position, 'y').name('Position y').min(-100).max(70);
	group.add(merged.position, 'z').name('Position z').min(-100).max(70);

	// rotation
	group.add(merged.rotation, 'x').name('Rotation x').min(-100).max(70);
	group.add(merged.rotation, 'y').name('Rotation y').min(-100).max(70);
	group.add(merged.rotation, 'z').name('Rotation z').min(-100).max(70);

	// light
	group.add(merged, 'intensity').name('Intensity').min(0).max(20);

	group.close();
}
