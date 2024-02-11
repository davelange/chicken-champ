import { writable } from 'svelte/store';
import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
import { getFromUrl, isElement } from './utils';
import { goto } from '$app/navigation';
import { pubs } from './pubs';

type WritableStore = {
	gameState: 'idle' | 'inProgress' | 'done';
	inMaze: boolean;
	moveAllowed: boolean;
	avatarType: 'light' | 'heavy';
	seed: string | undefined;
	entryTime: number;
	exitTime: number;
	timeCompleted: number;
};

function createGameStore() {
	const store = writable<WritableStore>({
		gameState: 'idle',
		inMaze: false,
		moveAllowed: false,
		avatarType: 'light',
		seed: undefined,
		entryTime: 0,
		exitTime: 0,
		timeCompleted: 0
	});
	let ref: WritableStore;
	store.subscribe((val) => (ref = val));

	function _set(args: Partial<WritableStore>) {
		store.update((st) => ({
			...st,
			...args
		}));
	}

	const { on, off, publish } = pubs(['inProgress', 'done', 'restartMaze']);

	function init() {
		const config = getFromUrl(['avatarType', 'seed'], new URL(location.href));

		if ((config.avatarType !== 'heavy' && config.avatarType !== 'light') || !config.seed) {
			return goto('/');
		}

		_set(config);
	}

	function enterMaze({ targetRigidBody }: { targetRigidBody: RapierRigidBody | null }) {
		if (!targetRigidBody || !isElement(targetRigidBody, 'avatar') || ref.inMaze) {
			return;
		}

		_set({ inMaze: true });
	}

	function exitMaze({ targetRigidBody }: { targetRigidBody: RapierRigidBody | null }) {
		if (!targetRigidBody || !isElement(targetRigidBody, 'avatar')) {
			return;
		}

		const now = Date.now();

		if (ref.inMaze) {
			_set({ gameState: 'done', exitTime: now, timeCompleted: now - ref.entryTime });
			publish('done');
		}
	}

	function restartMaze() {
		_set({
			gameState: 'inProgress',
			exitTime: 0,
			entryTime: Date.now(),
			timeCompleted: 0,
			inMaze: false
		});
		publish('restartMaze');
	}

	function countdownEnded() {
		_set({ gameState: 'inProgress', entryTime: Date.now() });
		publish('inProgress');

		setTimeout(() => {
			_set({ moveAllowed: true });
		}, 1000);
	}

	return {
		...store,
		enterMaze,
		exitMaze,
		restartMaze,
		countdownEnded,
		init,
		on,
		off
	};
}

const gameStore = createGameStore();

export { gameStore };
