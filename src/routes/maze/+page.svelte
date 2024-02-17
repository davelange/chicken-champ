<script lang="ts">
	import { Scene } from '$lib/scene';
	import { EndPanel, Config, Timer, ResetHint } from '$lib/components';
	import { gameStore } from '$lib/game';
	import { onMount } from 'svelte';
	import { Canvas } from '@threlte/core';
	import { avatarStore } from '$lib/avatar';

	onMount(() => {
		gameStore.init();
	});
</script>

<Canvas>
	{#if $gameStore.seed}
		<Scene seed={$gameStore.seed} />
	{/if}
</Canvas>
<Timer />
<Config />

{#if $gameStore.gameState === 'done'}
	<EndPanel />
{:else if $avatarStore.fallen}
	<ResetHint />
{/if}
