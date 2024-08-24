<script lang="ts">
	import { Debug, World } from '@threlte/rapier';
	import { interactivity } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { keyq } from '$lib/keyq';
	import { T } from '@threlte/core';
	import { swipe } from '$lib/swipe';
	import { createMaze } from '$lib/amaze';
	import { Avatar, Floor, Lights, OrthoCamera, Maze } from '$lib/scene';
	import { getConfig } from '$lib/config.svelte';
	import { getGameState } from '$lib/game.svelte';

	interactivity();

	let config = getConfig();
	let { store: gameState } = getGameState();

	let { seed }: { seed: string } = $props();
	let { maze, entrance, exit } = $derived.by(() =>
		createMaze({
			width: 8,
			height: 8,
			sizeUnit: 4,
			seed
		})
	);
	let avatarStartPoint = $derived<Triplet>([entrance[0] - 8, entrance[1], entrance[2]]);

	// Setup key and touch events
	onMount(() => {
		keyq.init();
		swipe.init();

		return () => {
			keyq.destroy();
			swipe.destroy();
		};
	});
</script>

<World>
	<OrthoCamera {maze} />
	<Lights />

	{#key gameState.seed}
		<Maze {maze} {entrance} {exit}>
			<Avatar initialPosition={avatarStartPoint} />
		</Maze>
	{/key}

	<Floor />
	{#if config.worldDebug}
		<Debug color="red" />
	{/if}
	{#if config.axes}
		<T.AxesHelper scale={10} />
	{/if}
</World>
