<script lang="ts">
	import Timer from '$lib/components/Timer.svelte';
	import { configStore } from '$lib/config';
</script>

<div class="root" style="color: {$configStore.mazeColor}">
	<Timer />
</div>

<style>
	.root {
		position: absolute;
		left: 1rem;
		top: 1rem;
		color: black;
	}
</style>
