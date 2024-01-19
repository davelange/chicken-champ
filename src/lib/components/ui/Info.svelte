<script lang="ts">
	import { game } from '$lib/game';
	import Timer from '$lib/components/Timer.svelte';
	import { configStore } from '$lib/config';
</script>

<div class="root" style="color: {$configStore.mazeColor}">
	{#if $game.appState === 'inGame'}
		<p>Using {$game.avatarType === 'heavy' ? 'Heavy and steady' : 'Light and shaky'}</p>
	{/if}

	{#if $game.seed}
		<p>Maze seed: {$game.seed}</p>
	{/if}
	<Timer />
</div>

<style>
	.root {
		position: absolute;
		left: 1rem;
		top: 1rem;
		color: black;
	}
</style>
