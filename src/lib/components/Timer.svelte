<script lang="ts">
	import { getAvatarState } from '$lib/avatar.svelte';
	import { getConfig } from '$lib/config.svelte';
	import { getGameState } from '$lib/game.svelte';
	import { onDestroy } from 'svelte';

	let config = getConfig();
	let gameState = getGameState();
	let { store: avatarState } = getAvatarState();

	let startTime = $state(new Date());
	let interval = $state<ReturnType<typeof setInterval>>();
	let timeStr = $state('');

	gameState.on('inProgress', start);
	gameState.on('restartMaze', start);
	gameState.on('done', () => clearInterval(interval));

	function getTimeDiffDesc() {
		const padStr = (val: number) => val.toString().padStart(2, '');

		let milliseconds = Date.now() - startTime?.getTime();
		let seconds = Math.floor(milliseconds / 1000);
		let mins = Math.floor(milliseconds / 1000 / 60);
		let millisecondsStr = padStr(Math.round(milliseconds / 100) % 60);
		let secondsStr = padStr(seconds % 60);
		let minsStr = padStr(mins);

		timeStr = `${minsStr}:${secondsStr}:${millisecondsStr}`;
	}

	function start() {
		startTime = new Date(gameState.store.entryTime);
		interval = setInterval(getTimeDiffDesc, 100);
	}

	onDestroy(() => {
		gameState.cleanup();
	});
</script>

<div
	class="absolute top-4 left-4 z-10 text-white font-bold text-xl"
	style="color: {config.mazeColor}"
>
	<span>{timeStr}</span>
	<br />
	{#if gameState.store.status === 'inProgress'}
		<span>{avatarState.jumpsRemaining} jumps left</span>
	{/if}
</div>
