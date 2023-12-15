<script lang="ts">
	import { game } from '$lib/game';
</script>

<div class="root">
	{#if $game.appState === 'inGame'}
		<p>Using {$game.avatarType === 'heavy' ? 'Heavy and steady' : 'Light and shaky'}</p>
	{/if}
</div>

<style>
	.root {
		position: absolute;
		left: 1rem;
		top: 1rem;
	}
</style>
