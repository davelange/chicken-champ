<script lang="ts">
	import { T } from '@threlte/core';
	import { RigidBody, AutoColliders, Collider } from '@threlte/rapier';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import { isElement } from '$lib/utils';
	import type { Triplet } from '../../types';
	import type { Structure } from '$lib/maze-generator';

	export let entrance: Triplet;
	export let exit: Triplet;
	export let maze: Structure[];

	let rigidBody: RapierRigidBody;
</script>

<RigidBody type="fixed" bind:rigidBody userData={{ name: 'maze' }}>
	<AutoColliders shape={'cuboid'} friction={2}>
		{#each maze as element, ind}
			<T.Mesh scale={element.dimension} receiveShadow position={element.position} key={ind}>
				<T.BoxGeometry />
				<T.MeshStandardMaterial color="lightseagreen" />
			</T.Mesh>
		{/each}
	</AutoColliders>
</RigidBody>
<T.Group position={entrance}>
	<Collider
		sensor
		shape="cuboid"
		args={[1, 3, 3]}
		on:sensorenter={(data) => {
			//$game.inMaze = isElement(data.targetRigidBody, 'avatar');
            if(isElement(data.targetRigidBody, 'avatar')) console.log("IN")
		}}
	/>
</T.Group>
<T.Group position={exit}>
	<Collider
		sensor
		shape="cuboid"
		args={[1, 3, 3]}
		on:sensorenter={(data) => {
			/* if (isElement(data.targetRigidBody, 'avatar')) {
				$game.inMaze = false;
			} */
            if(isElement(data.targetRigidBody, 'avatar')) console.log("OUT")
		}}
	/>
</T.Group>
