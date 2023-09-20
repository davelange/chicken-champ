import { writable } from 'svelte/store';
import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
import { Mesh } from 'three';
import type { AnimerStore } from './animer';

type PlayerWritableStore = {
	rigidBody: RapierRigidBody;
	tracker: Mesh | undefined;
};

const playerStore = writable<PlayerWritableStore>({
	rigidBody: undefined as unknown as RapierRigidBody,
	tracker: new Mesh()
});

let playerStoreRef: PlayerWritableStore;
let playerAnim: AnimerStore;
playerStore.subscribe((val) => (playerStoreRef = val));

function player() {
	function resetInPlace() {
		const current = playerStoreRef.rigidBody?.rotation();

		if (current) {
			playerAnim.go([
				{
                    type: "translate",
					force: { y: 10 },
					duration: 40,
					easing: { y: 'easeOutQuint' }
				},
				{
					force: { x: current.x * -1, z: current.z * -1 },
					duration: 40,
					type: 'rotate',
					easing: { x: 'easeOutQuint', y: 'easeOutQuint' }
				}
			]);
		}
	}

	return {
		...playerStore,
		resetInPlace
	};
}

export default player();
