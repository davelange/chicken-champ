<script lang="ts">
	import { T } from '@threlte/core';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import { MeshStandardMaterial } from 'three';

	const mesh = new MeshStandardMaterial({ color: '#333' });
</script>

<RigidBody type="fixed" gravityScale={0} userData={{ name: 'floor' }}>
	<AutoColliders shape={'cuboid'}>
		<T.Mesh scale={[1000, 0.2, 1000]} position={[0, -0.5, 0]} receiveShadow>
			<T.BoxGeometry />
			<T is={mesh} />
		</T.Mesh>
	</AutoColliders>
</RigidBody>
