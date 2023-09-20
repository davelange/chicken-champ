<script lang="ts">
	import { T } from '@threlte/core';
	import { useGltf } from '@threlte/extras';

	export let output = { x: 0, y: 0, z: 0 };

	let gltf = useGltf('/assets/chicken/scene.gltf');
	let FULL_ROTATION = Math.PI * 2;
	let rotationY = FULL_ROTATION / 4;

	function orientationCheck(
		data: typeof output,
		axis: keyof typeof output,
		compare: 'pos' | 'neg'
	) {
		let sum = 0;
		let axisCompare = compare === 'neg' ? data[axis] < 0 : data[axis] > 0;
		for (let k in data) {
			if (k !== axis) sum += (data as any)[k];
		}

		return sum === 0 && axisCompare;
	}

	function updateRotation(data: typeof output) {
		if (orientationCheck(data, 'x', 'pos')) {
			rotationY = FULL_ROTATION / 4;
			return;
		}
		if (orientationCheck(data, 'x', 'neg')) {
			rotationY = (FULL_ROTATION / 4) * -1;
			return;
		}
		if (orientationCheck(data, 'z', 'neg')) {
			rotationY = FULL_ROTATION / 2;
			return;
		}
		if (orientationCheck(data, 'z', 'pos')) {
			rotationY = FULL_ROTATION;
			return;
		}
	}

	$: updateRotation(output);
</script>

{#if $gltf}
	<T.Mesh
		castShadow
		geometry={$gltf.nodes.Object_4.geometry}
		material={$gltf.materials.Material}
		scale={[0.73, 1.2, 0.73]}
		rotation={[0, rotationY, 0]}
		position={[0, -0.9, 0]}
	/>
{/if}
