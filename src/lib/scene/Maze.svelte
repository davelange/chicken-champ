<script lang="ts">
	import { T } from '@threlte/core';
	import { RigidBody, AutoColliders, Collider } from '@threlte/rapier';
	import { Vector3, type RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import { getConfig } from '$lib/config.svelte';
	import { RoundedBoxGeometry } from '@threlte/extras';
	import { getGameState } from '$lib/game.svelte';
	import { ControlsDemo } from '$lib/scene';
	import type { Snippet } from 'svelte';
	import { createTransition } from '$lib/transition';
	import { interpolateColor, randInRange } from '$lib/utils';
	import { Group, Mesh, MeshStandardMaterial } from 'three';

	type MazeProps = { entrance: Triplet; exit: Triplet; maze: MazeBlock[]; children: Snippet };

	// depends on maze creation
	let mazeHeight = 3;

	let { entrance, exit, maze, children }: MazeProps = $props();

	let config = getConfig();
	let { store: gameState } = getGameState();
	let introComplete = $state(false);
	let rigidBody = $state<RapierRigidBody>();
	let mazePosOffset = $state(0);

	let moveUpIn = createTransition<Mesh>((ref) => {
		return {
			tick(t) {
				ref.position.setY((mazeHeight - mazeHeight * t) * -1);
			},
			onEnd() {
				ref.castShadow = true;
			},
			easing: 'expoIn',
			duration: 100
		};
	});

	let fadeIn = createTransition<MeshStandardMaterial>((ref) => {
		const animateColor = interpolateColor(config.floorColor, config.mazeColor);

		return {
			tick(t) {
				ref.color.set(animateColor(t));
			},
			onEnd() {
				ref.color.set(config.mazeColor);
				introComplete = true;
			},
			easing: 'expoIn',
			duration: 100
		};
	});

	$effect(() => {
		// reposition rigid body to match mesh
		if (introComplete) {
			let { x, z, y } = rigidBody!.translation();
			rigidBody?.setTranslation(new Vector3(x, mazeHeight + y + 1, z), true);
		}
	});

	let group = $state<Group>();

	function calcMazeOffset() {
		mazePosOffset = ((maze.at(-1)!.position[2] - 4) / 2) * -1;
	}

	$effect(() => {
		calcMazeOffset();
	});
</script>

<T.Group bind:ref={group} position={[mazePosOffset, mazeHeight / 2, mazePosOffset]}>
	{#if gameState.status !== 'idle'}
		<RigidBody
			type="fixed"
			bind:rigidBody
			userData={{ name: 'maze' }}
			dominance={10}
			enabled={introComplete}
		>
			<AutoColliders shape={'cuboid'}>
				{#each maze as element, ind}
					<T.Mesh
						scale={element.dimension}
						position={[element.position[0], -mazeHeight, element.position[2]]}
						key={ind}
						oncreate={moveUpIn}
					>
						<RoundedBoxGeometry />
						<T.MeshStandardMaterial
							color={introComplete ? config.mazeColor : config.floorColor}
							flatShading
							oncreate={fadeIn}
						/>
					</T.Mesh>
				{/each}
			</AutoColliders>
		</RigidBody>

		<T.Group position={entrance}>
			<Collider
				sensor
				shape="cuboid"
				args={[0.1, 3, 3]}
				onsensorenter={({ targetRigidBody }) => gameState.enterMaze({ targetRigidBody })}
			/>
		</T.Group>
		<T.Group position={exit}>
			<Collider
				sensor
				shape="cuboid"
				args={[0.1, 3, 3]}
				onsensorenter={({ targetRigidBody }) => gameState.exitMaze({ targetRigidBody })}
			/>
		</T.Group>
	{/if}

	{@render children()}
</T.Group>

{#if gameState.status === 'idle'}
	<ControlsDemo />
{/if}
