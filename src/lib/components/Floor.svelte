<script lang="ts">
	import { T } from '@threlte/core';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
</script>

<RigidBody type="fixed" gravityScale={0} userData={{ name: 'floor' }}>
	<AutoColliders shape={'cuboid'}>
		<T.Mesh position={[0, -0.5, 0]} receiveShadow frustumCulled={false}>
			<T.BoxGeometry args={[3000, 0.2, 3000]} />
			<T.MeshStandardMaterial color="#333" />
		</T.Mesh>
	</AutoColliders>
</RigidBody>
