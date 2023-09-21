import { writable } from 'svelte/store';
import { Object3D, Vector3 } from 'three';
import type { Vector } from '@dimforge/rapier3d-compat';

// Tracks the avatar position, used to move the shadow camera
const store = writable(new Object3D());

export function tracker() {
	function update(position: Vector) {
		store.update((store) => {
			store.position.lerp(new Vector3(position.x, position.y, position.z), 0.01);

			return store;
		});
	}

	return {
		...store,
		update
	};
}

const avatarTracker = tracker();

export { avatarTracker };
