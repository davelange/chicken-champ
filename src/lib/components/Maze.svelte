<script lang="ts">
	import { T } from '@threlte/core';
	import { RigidBody, AutoColliders, Collider } from '@threlte/rapier';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import { configStore } from '$lib/config';
	import { createTransition } from '@threlte/extras';
	import type { Mesh, MeshStandardMaterial } from 'three';
	import { bounceInOut, circIn, quadIn } from 'svelte/easing';
	import { interpolateColor, randInRange } from '$lib/utils';
	import { gameStore } from '$lib/game';

	export let entrance: Triplet;
	export let exit: Triplet;
	export let maze: MazeBlock[];

	let rigidBody: RapierRigidBody;

	const moveUpIn = createTransition<Mesh>((ref) => {
		return {
			tick(t) {
				ref.position.setY(t * 4 - 4);

				if (t === 1) {
					ref.castShadow = true;
				}
			},
			easing: bounceInOut,
			duration: randInRange(1200, 2000),
			delay: randInRange(100, 200)
		};
	});

	const fadeIn = createTransition<MeshStandardMaterial>((ref) => {
		const animateColor = interpolateColor($configStore.floorColor, $configStore.mazeColor);

		return {
			tick(t) {
				ref.color.set(animateColor(t));
			},
			easing: quadIn,
			duration: 1000,
			delay: 700
		};
	});
</script>

<T.Group position={[-24, 1, -24]}>
	<RigidBody type="fixed" bind:rigidBody userData={{ name: 'maze' }} dominance={10}>
		<AutoColliders shape={'cuboid'}>
			{#each maze as element, ind}
				<T.Mesh
					scale={element.dimension}
					position={[element.position[0], 0, element.position[2]]}
					key={ind}
					transition={moveUpIn}
				>
					<T.BoxGeometry />
					<T.MeshStandardMaterial transition={fadeIn} color={$configStore.floorColor} flatShading />
				</T.Mesh>
			{/each}
		</AutoColliders>
	</RigidBody>

	<T.Group position={entrance}>
		<Collider sensor shape="cuboid" args={[0.1, 3, 3]} on:sensorenter={gameStore.onMazeEnter} />
	</T.Group>
	<T.Group position={exit}>
		<Collider sensor shape="cuboid" args={[0.1, 3, 3]} on:sensorenter={gameStore.onMazeExit} />
	</T.Group>

	<slot />
</T.Group>
