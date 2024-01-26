import { writable } from 'svelte/store';
import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
import { getFromUrl, isElement } from './utils';
import { goto } from '$app/navigation';

type WritableStore = {
	gameState: 'idle' | 'inProgress' | 'done';
	inMaze: boolean;
	moveAllowed: boolean;
	avatarType: 'light' | 'heavy';
	seed: string | undefined;
	entryTime: number;
	exitTime: number;
};

function createGameStore() {
	const store = writable<WritableStore>({
		gameState: 'idle',
		inMaze: false,
		moveAllowed: false,
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
		if (!targetRigidBody || !isElement(targetRigidBody, 'avatar') || ref.inMaze) {
			return;
		}
		console.log('enter!');
		_set({ inMaze: true });
	}

	function onMazeExit({ targetRigidBody }: { targetRigidBody: RapierRigidBody | null }) {
		if (!targetRigidBody || !isElement(targetRigidBody, 'avatar')) {
			return;
		}

		if (ref.inMaze) {
			_set({ gameState: 'done', exitTime: Date.now() });
		}
	}

	function onCountdownEnded() {
		_set({ gameState: 'inProgress', entryTime: Date.now() });
		setTimeout(() => {
			_set({ moveAllowed: true });
		}, 1000);
	}

	return {
		...store,
		onMazeEnter,
		onMazeExit,
		onCountdownEnded,
		init
	};
}

const gameStore = createGameStore();

export { gameStore };
