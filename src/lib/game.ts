import { writable } from 'svelte/store';
import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
import { getFromUrl, isElement } from './utils';
import { goto } from '$app/navigation';

type WritableStore = {
	gameState: 'idle' | 'inProgress' | 'done';
	inMaze: boolean;
	avatarType: 'light' | 'heavy';
	seed: string | undefined;
	entryTime: number;
	exitTime: number;
};

function createGameStore() {
	const store = writable<WritableStore>({
		gameState: 'idle',
		inMaze: false,
		avatarType: 'light',
		seed: undefined,
		entryTime: 0,
		exitTime: 0
	});
	let ref: WritableStore;
	store.subscribe((val) => (ref = val));

	function _set(args: Partial<WritableStore>) {
		store.update((st) => ({
			...st,
			...args
		}));
	}

	function init() {
		const config = getFromUrl(['avatarType', 'seed'], new URL(location.href));

		if ((config.avatarType !== 'heavy' && config.avatarType !== 'light') || !config.seed) {
			return goto('/');
		}

		_set(config);
	}

	function onMazeEnter({ targetRigidBody }: { targetRigidBody: RapierRigidBody | null }) {
		if (!targetRigidBody || !isElement(targetRigidBody, 'avatar')) {
			return;
		}

		_set({ inMaze: true, entryTime: Date.now() });
	}

	function onMazeExit({ targetRigidBody }: { targetRigidBody: RapierRigidBody | null }) {
		if (!targetRigidBody || !isElement(targetRigidBody, 'avatar')) {
			return;
		}

		if (ref.inMaze) {
			_set({ gameState: 'done', exitTime: Date.now() });
		}
	}

	return {
		subscribe: store.subscribe,
		onMazeEnter,
		onMazeExit,
		init
	};
}

const gameStore = createGameStore();

export { gameStore };
