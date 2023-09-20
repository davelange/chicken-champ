<script lang="ts">
	import { T, Canvas } from '@threlte/core';
	import { Debug, World } from '@threlte/rapier';
	import OrthoCamera from './OrthoCamera.svelte';
	import Lights from './Lights.svelte';
	import { BoxGeometry, MeshBasicMaterial } from 'three';
	import Floor from './Floor.svelte';
	import Avatar from './Avatar.svelte';
</script>

<Canvas>
	<World>
		<OrthoCamera />
		<Lights />

		<Avatar />
		<Floor />
	</World>
</Canvas>
