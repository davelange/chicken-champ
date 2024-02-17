import { writable } from 'svelte/store';
import { Vector3 as RapierVector3 } from '@dimforge/rapier3d-compat';
import { pubs } from './pubs';
import { gameStore } from './game';

type WritableStore = {
	fallen: boolean;
	physicalState: AvatarPhysicalState;
	lastSafePosition: RapierVector3;
};

function createAvatarStore() {
	const store = writable<WritableStore>({
		fallen: false,
		physicalState: 'idle',
		lastSafePosition: new RapierVector3(0, 0, 0)
	});

	function _set(args: Partial<WritableStore>) {
		store.update((st) => ({
			...st,
			...args
		}));
	}

	const { on, off, publish } = pubs(['reset']);

	gameStore.on('restartMaze', () => {
		_set({
			fallen: false
		});
	});

	return {
		...store,
		on,
		off,
		publish
	};
}

const avatarStore = createAvatarStore();

export { avatarStore };
