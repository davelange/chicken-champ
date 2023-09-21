<script lang="ts">
	import { Debug, World } from '@threlte/rapier';
	import { interactivity } from '@threlte/extras';

	import OrthoCamera from './OrthoCamera.svelte';
	import Lights from './Lights.svelte';
	import Floor from './Floor.svelte';
	import Avatar from './Avatar.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { keyq } from '$lib/keyq';
	import { T } from '@threlte/core';

	interactivity();

	onMount(() => {
		keyq.init();
	});

	onDestroy(() => {
		keyq.destroy();
	});
</script>

<World>
	<OrthoCamera />
	<Lights />

	<Avatar />
	<Floor />
	<Debug />
	<T.AxesHelper scale={10} />
</World>
