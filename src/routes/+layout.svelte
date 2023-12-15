<script lang="ts">
	import Info from '$lib/components/ui/Info.svelte';
	import { initGame } from '$lib/game';

	initGame();
</script>

<svelte:head>
	<title>Chicken Champ</title>
</svelte:head>
<div class="root">
	<slot />
	<Info />
</div>

<style>
	.root {
		height: 100%;
		width: 100%;
	}
</style>
