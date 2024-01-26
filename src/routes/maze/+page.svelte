<script lang="ts">
	import { Scene } from '$lib/scene';
	import { Config, Timer } from '$lib/components';
	import { gameStore } from '$lib/game';
	import { onMount } from 'svelte';
	import { Canvas } from '@threlte/core';

	onMount(() => {
		gameStore.init();
	});
</script>

<Canvas>
	<Scene />
</Canvas>
<Timer />
<Config />
