<script lang="ts">
	import { T, Canvas } from '@threlte/core';
	import { Debug, World } from '@threlte/rapier';
	import OrthoCamera from './OrthoCamera.svelte';
	import Lights from './Lights.svelte';
	import { BoxGeometry, MeshBasicMaterial } from 'three';
</script>

<Canvas>
	<World>
		<OrthoCamera />
		<Lights />
		<T.Mesh>
			<T.BoxGeometry args={[2, 2, 2]} />
			<T.MeshBasicMaterial color="red" />
		</T.Mesh>
	</World>
</Canvas>
