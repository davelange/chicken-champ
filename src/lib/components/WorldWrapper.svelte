<script lang="ts">
	import type { Triplet } from '../../types';
	import { Debug, World } from '@threlte/rapier';
	import { interactivity } from '@threlte/extras';

	import OrthoCamera from './OrthoCamera.svelte';
	import Lights from './Lights.svelte';
	import Floor from './Floor.svelte';
	import Avatar from './Avatar.svelte';
	import { onMount } from 'svelte';
	import { keyq } from '$lib/keyq';
	import { T } from '@threlte/core';
	import Maze from './Maze.svelte';
	import { configStore } from '$lib/config';
	import { swipe } from '$lib/swipe';
	import { maze, entrance, exit } from '$lib/amaze';

	interactivity();

	onMount(() => {
		keyq.init();
		swipe.init();

		return () => {
			keyq.destroy();
			swipe.destroy();
		};
	});

	$: avatarStartPoint = [entrance[0] - 8, entrance[1], entrance[2]] as Triplet;
</script>

´<World>
	<OrthoCamera {maze} />
	<Lights />

	<Maze {maze} {entrance} {exit}>
		<Avatar initialPosition={avatarStartPoint} />
	</Maze>
	<Floor />
	{#if $configStore.worldDebug}
		<Debug />
	{/if}
	{#if $configStore.axes}
		<T.AxesHelper scale={10} />
	{/if}
</World>
