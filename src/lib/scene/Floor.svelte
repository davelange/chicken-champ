<script lang="ts">
	import { getConfig } from '$lib/config.svelte';
	import { T } from '@threlte/core';
	import { Grid } from '@threlte/extras';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import { degToRad } from 'three/src/math/MathUtils.js';

	let config = getConfig();
</script>

<RigidBody type="fixed" gravityScale={0} userData={{ name: 'floor' }} dominance={127}>
	<AutoColliders shape={'cuboid'}>
		<T.Mesh position={[0, -0.1, 0]} receiveShadow frustumCulled={false} rotation.y={degToRad(45)}>
			<T.BoxGeometry args={[3000, 0.1, 3000]} />
			<T.MeshStandardMaterial color={config.floorColor} />
		</T.Mesh>
	</AutoColliders>
</RigidBody>

{#if config.floorGrid}
	<Grid
		infiniteGrid
		position={[2, 0, 2]}
		cellColor="red"
		cellSize={4}
		sectionSize={3}
		sectionThickness={0}
	/>
{/if}
