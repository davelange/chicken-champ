import { page } from '$app/stores';
import { writable } from 'svelte/store';

export const game = writable<{
	appState: 'avatarSelect' | 'inGame';
	gameState: 'idle' | 'inMaze' | 'done';
	avatarType: 'light' | 'heavy';
	seed: number | undefined;
}>({
	appState: 'avatarSelect',
	gameState: 'idle',
	avatarType: 'light',
	seed: undefined
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

export function initGame() {
	page.subscribe(({ url }) => {
		setFromUrl(url, 'avatarType');
		setFromUrl(url, 'seed');
		setGameState(url);
	});
}
