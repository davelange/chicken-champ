<script lang="ts">
	import { configStore } from '$lib/config';
	import { gameStore } from '$lib/game';
	import { onMount } from 'svelte';

	let startTime: Date = new Date();
	let interval: ReturnType<typeof setInterval>;
	let timeStr = '';

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
		startTime = new Date($gameStore.entryTime);
		interval = setInterval(getTimeDiffDesc, 100);
	}

	onMount(() => {
		gameStore.on('inProgress', start, 'timer');
		gameStore.on('restartMaze', start, 'timer');
		gameStore.on('done', () => clearInterval(interval), 'timer');

		return () => {
			gameStore.off('timer');
		};
	});
</script>

<div
	class="absolute top-4 left-4 z-10 text-white font-bold text-xl"
	style="color: {$configStore.mazeColor}"
>
	{timeStr}
</div>
