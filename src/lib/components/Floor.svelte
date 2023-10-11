<script lang="ts">
	import { configStore } from '$lib/config';
	import { T } from '@threlte/core';
	import { Grid } from '@threlte/extras';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
</script>

<RigidBody type="fixed" gravityScale={0} userData={{ name: 'floor' }}>
	<AutoColliders shape={'cuboid'}>
		<T.Mesh position={[0, -0.5, 0]} receiveShadow frustumCulled={false}>
			<T.BoxGeometry args={[3000, 0.2, 3000]} />
			<T.MeshStandardMaterial color="#eee" />
		</T.Mesh>
	</AutoColliders>
</RigidBody>

{#if $configStore.floorGrid}
	<Grid
		infiniteGrid
		position={[2, 0, 2]}
		cellColor="red"
		cellSize={4}
		sectionSize={3}
		sectionThickness={0}
	/>
{/if}
