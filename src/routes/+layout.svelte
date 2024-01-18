<script lang="ts">
	import '../app.css';
	import Info from '$lib/components/ui/Info.svelte';
	import { initGame } from '$lib/game';

	initGame();
</script>

<svelte:head>
	<title>Chicken Champ</title>
</svelte:head>
<div class="bg-zinc-900 text-zinc-300 font-mono flex-1">
	<slot />
	<Info />
</div>

<!-- <style>
	.root {
		min-height: 100vh;
		height: 100%;
		width: 100%;
	}
</style> -->
