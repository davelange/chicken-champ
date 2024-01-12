<script lang="ts">
	import { game } from '$lib/game';

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

	game.subscribe((state) => {
		if (state.gameState === 'inMaze') {
			startTime = new Date($game.entryTime);
			interval = setInterval(getTimeDiffDesc, 100);
		} else if (state.gameState === 'done') {
			clearInterval(interval);
		}
	});
</script>

<p>
	{timeStr}
</p>
