<script lang="ts">
	import { getGameState } from '$lib/game.svelte';

	const padStr = (val: number) => val.toString().padStart(2, '');

	let { store: gameState } = getGameState();

	let finalTimeDate = $derived(new Date(gameState.timeCompleted));
	let finalTimeStr = $derived(
		`${padStr(finalTimeDate.getMinutes())}:${padStr(finalTimeDate.getSeconds())}:${finalTimeDate.getMilliseconds()}`
	);
</script>

<div
	class="root absolute inset-0 bottom-[10vh] m-auto h-fit w-[540px] max-w-[90vw] p-6 text-center border border-white bg-black bg-opacity-50 rounded-lg"
>
	<h2 class="font-bold text-2xl mb-4">Well done!</h2>
	<p class="mb-4">Your time: {finalTimeStr}</p>

	<div class="flex gap-4 justify-center">
		<button class="underline" type="button" onclick={gameState.restartMaze}>
			Try this maze again
		</button>
		<button class="underline" type="button" onclick={gameState.goToNewGame}>
			Try another maze
		</button>
	</div>
</div>
