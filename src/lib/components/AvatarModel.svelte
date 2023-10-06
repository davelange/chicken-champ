<script lang="ts">
	import { T } from '@threlte/core';
	import { useGltf } from '@threlte/extras';

	let gltf = useGltf('/assets/chicken/scene.gltf');
	let FULL_ROTATION = Math.PI * 2;
	let rotationY = FULL_ROTATION / 4;
</script>

{#if $gltf}
	<T.Mesh
		castShadow
		geometry={$gltf.nodes.Object_4.geometry}
		material={$gltf.materials.Material}
		scale={[0.73, 1.4, 0.73]}
		position={[0.4, -0.9, 0]}
		rotation={[0, rotationY, 0]}
	/>
{/if}
