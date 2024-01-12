<script lang="ts">
	import { game } from '$lib/game';
</script>

<div class="root">
	{#if $game.appState === 'inGame'}
		<p>Using {$game.avatarType === 'heavy' ? 'Heavy and steady' : 'Light and shaky'}</p>
	{/if}

	{#if $game.seed}
		<p>Maze seed: {$game.seed}</p>
	{/if}
</div>

<style>
	.root {
		position: absolute;
		left: 1rem;
		top: 1rem;
	}
</style>
