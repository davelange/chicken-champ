<script lang="ts">
	import Scene from '$lib/components/Scene.svelte';
	import Config from '$lib/components/ui/Config.svelte';
	import { gameStore } from '$lib/game';
	import { Canvas } from '@threlte/core';
	import { onMount } from 'svelte';

	onMount(() => {
		gameStore.init();
	});
</script>

<Canvas>
	<Scene />
</Canvas>
<Config />
