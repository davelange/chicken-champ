<script lang="ts">
	import type { Triplet } from '../../types';
	import { Debug, World } from '@threlte/rapier';
	import { interactivity } from '@threlte/extras';

	import OrthoCamera from './OrthoCamera.svelte';
	import Lights from './Lights.svelte';
	import Floor from './Floor.svelte';
	import Avatar from './Avatar.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { keyq } from '$lib/keyq';
	import { T } from '@threlte/core';
	import { MazeBuilder } from '$lib/maze-generator';
	import Maze from './Maze.svelte';
	import { debug } from '$lib/constants';

	interactivity();

	onMount(() => {
		keyq.init();
	});
	onDestroy(() => {
		keyq.destroy();
	});

	let { maze, entrance, exit } = new MazeBuilder(8, 8).getElements();

	$: avatarStartPoint = [entrance[0] - 10, entrance[1], entrance[2]] as Triplet;
</script>

<World>
	<OrthoCamera />
	<Lights />

	<Avatar initialPosition={avatarStartPoint} />
	<Maze {maze} {entrance} {exit} />
	<Floor />
	{#if debug.world}
		<Debug />
	{/if}
	{#if debug.axes}
		<T.AxesHelper scale={10} />
	{/if}
</World>
