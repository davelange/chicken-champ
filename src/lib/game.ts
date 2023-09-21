import { writable } from 'svelte/store';

export const game = writable<{
	status: 'idle' | 'inMaze' | 'outMaze';
}>({
	status: 'idle'
});
