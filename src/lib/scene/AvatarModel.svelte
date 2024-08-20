<script lang="ts">
	import { T } from '@threlte/core';
	import { useGltf } from '@threlte/extras';
	import type { Mesh } from 'three';

	type AvatarModelProps = { physicalState: AvatarPhysicalState };

	let { physicalState }: AvatarModelProps = $props();

	let mesh = $state<Mesh>();
	let gltf = useGltf('/assets/chicken/scene.gltf');
	let FULL_ROTATION = Math.PI * 2;
	let rotationY = FULL_ROTATION / 4;

	let yScale = $derived(physicalState === 'crouch' ? 1.3 : 1.5);
</script>

{#if $gltf}
	<T.Group scale={[1, yScale, 1]} position={[0, -1.9, 0]}>
		<T.Mesh
			on:create={({ ref }) => {
				ref.geometry.center();
			}}
			ref={mesh}
			castShadow
			position={[0.4, 0.75, 0]}
			geometry={$gltf.nodes.Object_4.geometry}
			material={$gltf.materials.Material}
			scale={[0.74, 1, 0.74]}
			rotation={[0, rotationY, 0]}
		/>
	</T.Group>
{/if}
