<script>
	import Scene from '$lib/components/Scene.svelte';
	import Config from '$lib/components/ui/Config.svelte';
	import { game } from '$lib/game';
	import { Canvas } from '@threlte/core';

	const statusText = {
		idle: 'Get inside',
		inMaze: 'In the maze',
		outMaze: 'you made it!'
	};
</script>

<div>
	<Canvas>
		<Scene />
	</Canvas>
	<Config />

	<p class="status">
		{statusText[$game.status]}
	</p>
</div>

<style>
	div {
		height: 100%;
		width: 100%;
	}
	.status {
		position: absolute;
		left: 1rem;
		bottom: 1rem;
		color: white;
	}
</style>
