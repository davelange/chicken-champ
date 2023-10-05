<script lang="ts">
	import { debug } from '$lib/constants';
	import type { Structure } from '$lib/maze-generator';
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { onMount } from 'svelte';
	import type { OrthographicCamera } from 'three';
	import { degToRad } from 'three/src/math/MathUtils';

	export let maze: Structure[];

	let camera: OrthographicCamera;
	let buffer = 10;
	let maxZoom = 10;

	function zoomToFit(edge: number) {
		const newZoom = camera.right / (edge + camera.position.x + camera.position.y + buffer);

		camera.zoom = Math.min(newZoom, maxZoom);
		camera.updateProjectionMatrix();
	}

	onMount(() => {
		window.addEventListener('resize', () => {
			zoomToFit(Math.abs(maze[0].position[0]));
		});
	});
</script>

<T.OrthographicCamera
	bind:ref={camera}
	makeDefault
	position={[5, 5.5, 5]}
	fov={100}
	near={-2000}
	zoom={1}
	on:create={({ ref }) => {
		ref.lookAt(0, 0, 0);
		zoomToFit(Math.abs(maze[0].position[0]));
	}}
>
	{#if debug.orbitControls}
		<OrbitControls maxPolarAngle={degToRad(80)} enableZoom target={[0, 0.5, 0]} />
	{/if}
</T.OrthographicCamera>
