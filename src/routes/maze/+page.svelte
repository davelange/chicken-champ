<script lang="ts">
	import { Scene } from '$lib/scene';
	import { Config, Timer, ResetHint } from '$lib/components';
	import { gameStore } from '$lib/game';
	import { onMount } from 'svelte';
	import { Canvas } from '@threlte/core';
	import { avatarStore } from '$lib/avatar';

	onMount(() => {
		gameStore.init();
	});
</script>

<Canvas>
	<Scene />
</Canvas>
<Timer />
<Config />

{#if $avatarStore.fallen}
	<ResetHint />
{/if}
