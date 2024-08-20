<script lang="ts">
	import { Scene } from '$lib/scene';
	import { EndPanel, Config, Timer, ResetHint } from '$lib/components';
	import { Canvas } from '@threlte/core';
	import { initAvatarState } from '$lib/avatar.svelte';
	import { initConfig } from '$lib/config.svelte';
	import { initGameState } from '$lib/game.svelte';

	initConfig();
	let avatarState = initAvatarState();
	let gameState = initGameState();
</script>

<Canvas>
	{#if gameState.seed}
		<Scene seed={gameState.seed} />
	{/if}
</Canvas>
<Timer />
<Config />

{#if gameState.status === 'done'}
	<EndPanel />
{:else if avatarState.fallen}
	<ResetHint />
{/if}
