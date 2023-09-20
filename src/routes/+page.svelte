<script>
	import WorldWrapper from '$lib/components/WorldWrapper.svelte';
	import { Canvas } from '@threlte/core';
</script>

<div>
	<Canvas>
		<WorldWrapper />
	</Canvas>
</div>

<style>
	div {
		height: 100%;
		width: 100%;
	}
</style>
