import { page } from '$app/stores';
import { writable } from 'svelte/store';

export const game = writable<{
	appState: 'avatarSelect' | 'inGame';
	gameState: 'idle' | 'inMaze' | 'done';
	avatarType: 'light' | 'heavy';
}>({
	appState: 'avatarSelect',
	gameState: 'idle',
	avatarType: 'light'
});

function setAvatarType(url: URL) {
	const setting = url.searchParams.get('avatar');

	if (setting) {
		game.update((st) => {
			if (setting !== st.avatarType) {
				st.avatarType = setting as 'light' | 'heavy';
			}

			return st;
		});
	}
}

function setGameState(url: URL) {
	if (url.pathname === '/maze') {
		game.update((st) => ({ ...st, appState: 'inGame' }));
	}
}

export function initGame() {
	page.subscribe(({ url }) => {
		setAvatarType(url);
		setGameState(url);
	});
}
