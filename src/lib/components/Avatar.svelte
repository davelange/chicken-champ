<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { Collider, RigidBody } from '@threlte/rapier';
	import { Vector3, Vector4 } from 'three';
	import AvatarModel from './AvatarModel.svelte';

	export let initialPosition = [-40, 0, 0] as [x: number, y: number, z: number];

	let direction = { x: 0, y: 0, z: 0 };
</script>

<T.Group position={initialPosition}>
	<RigidBody type="dynamic" gravityScale={4} enabledRotations={[true, false, true]}>
		<T.Group position={[0, 1.8, 0]}>
			<Collider sensor shape="cuboid" args={[0.8, 0.2, 0.8]} />
		</T.Group>
		<Collider mass={1} shape="cuboid" args={[0.8, 1.8, 0.8]} contactForceEventThreshold={2} />
		<AvatarModel output={direction} />
		<T.Mesh castShadow scale={[1, 1, 1]} position={[-40, 0, 0]} />
	</RigidBody>
</T.Group>
