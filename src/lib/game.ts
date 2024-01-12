import { page } from '$app/stores';
import { writable } from 'svelte/store';
import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
import { isElement } from './utils';
import type { Collider } from '@threlte/rapier';

export const game = writable<{
	appState: 'avatarSelect' | 'inGame';
	gameState: 'idle' | 'inMaze' | 'done';
	avatarType: 'light' | 'heavy';
	seed: number | undefined;
	entryTime: number
	exitTime: number
}>({
	appState: 'avatarSelect',
	gameState: 'idle',
	avatarType: 'light',
	seed: undefined,
	entryTime: 0,
	exitTime: 0,
});

function setGameState(url: URL) {
	if (url.pathname === '/maze') {
		game.update((st) => ({ ...st, appState: 'inGame' }));
	}
}

function setFromUrl(url: URL, key: string) {
	const value = url.searchParams.get(key);

	if (value) {
		game.update((st) => ({ ...st, [key]: value }));
	}
}

export function handleMazeEnter({targetRigidBody}: {targetRigidBody: RapierRigidBody | null}) {
	if(!targetRigidBody || !isElement(targetRigidBody, 'avatar')) {
		return
	}

	
	game.update(store => {
		if(store.gameState === 'idle') {
			store.gameState = 'inMaze'
			store.entryTime = Date.now()
		}

		return store
	})
}

export function handleMazeExit({targetRigidBody}: {targetRigidBody: RapierRigidBody | null}) {
	if(!targetRigidBody || !isElement(targetRigidBody, 'avatar')) {
		return
	}

	
	game.update(store => {
		if(store.gameState === 'inMaze') {
			store.gameState = 'done'
			store.exitTime = Date.now()
		}

		return store
	})
}

export function initGame() {
	page.subscribe(({ url }) => {
		setFromUrl(url, 'avatarType');
		setFromUrl(url, 'seed');
		setGameState(url);
	});
}
