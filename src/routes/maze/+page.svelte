<script lang="ts">
	import Scene from '$lib/components/Scene.svelte';
	import Config from '$lib/components/ui/Config.svelte';
	import { gameStore } from '$lib/game';
	import { onMount } from 'svelte';
	import { Canvas } from '@threlte/core';
	import Timer from '$lib/components/Timer.svelte';

	onMount(() => {
		gameStore.init();
	});
</script>

<Canvas>
	<Scene />
</Canvas>
<Timer />
<Config />
