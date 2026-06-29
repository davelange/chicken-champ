<script lang="ts">
	import { Scene } from '$lib/scene';
	import { EndPanel, Timer, ResetHint } from '$lib/components';
	import { Canvas } from '@threlte/core';
	import { initAvatarState } from '$lib/avatar.svelte';
	import { initConfig } from '$lib/config.svelte';
	import { initGameState } from '$lib/game.svelte';

	initConfig();
	let gameState = initGameState();
	let avatarState = initAvatarState();

	$inspect(gameState.seed);
</script>

<Canvas>
	{#if gameState.seed}
		<Scene seed={gameState.seed} />
	{/if}
</Canvas>
<Timer />

{#if gameState.status === 'done'}
	<EndPanel />
{:else if avatarState.fallen}
	<ResetHint />
{/if}
