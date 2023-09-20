<script lang="ts">
	import { T } from '@threlte/core';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
</script>

<RigidBody type="fixed" gravityScale={0} userData={{ name: 'floor' }}>
	<AutoColliders shape={'cuboid'}>
		<T.Mesh
			scale={[1000, 0.2, 1000]}
			position={[0, -0.5, 0]}
			receiveShadow
			on:click={() => console.log('here')}
		>
			<T.BoxGeometry />
			<T.MeshStandardMaterial color="#222" />
		</T.Mesh>
	</AutoColliders>
</RigidBody>
