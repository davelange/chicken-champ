<script lang="ts">
	import { Debug, World } from '@threlte/rapier';
	import { interactivity, transitions } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { keyq } from '$lib/keyq';
	import { T } from '@threlte/core';
	import { configStore, initConfig } from '$lib/config';
	import { swipe } from '$lib/swipe';
	import { createMaze } from '$lib/amaze';
	import { gameStore } from '$lib/game';
	import { Avatar, Floor, Lights, OrthoCamera, Maze } from '$lib/scene';

	interactivity();
	transitions();

	const { entrance, exit, maze } = createMaze({
		width: 8,
		height: 8,
		sizeUnit: 4,
		seed: $gameStore.seed
	});

	onMount(() => {
		keyq.init();
		swipe.init();
		initConfig();

		return () => {
			keyq.destroy();
			swipe.destroy();
		};
	});

	$: avatarStartPoint = [entrance[0] - 8, entrance[1], entrance[2]] as Triplet;
</script>

<World>
	<OrthoCamera {maze} />
	<Lights />

	<Maze {maze} {entrance} {exit}>
		<Avatar initialPosition={avatarStartPoint} />
	</Maze>
	<Floor />
	{#if $configStore.worldDebug}
		<Debug color="red" />
	{/if}
	{#if $configStore.axes}
		<T.AxesHelper scale={10} />
	{/if}
</World>
