<script lang="ts">
	import type { Structure } from '$lib/maze-generator';
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { onMount } from 'svelte';
	import type { OrthographicCamera } from 'three';
	import { degToRad } from 'three/src/math/MathUtils';
	import type { Triplet } from '../../types';
	import { configStore } from '$lib/config';
	import { debounce } from '$lib/utils';

	export let maze: Structure[];

	let camera: OrthographicCamera;
	let buffer = 10;
	let maxZoom = 10;
	let view: Record<string, Triplet> = {
		ortho: [5, 5.5, 5],
		vertical: [0, 5.5, 0]
	};

	function zoomToFit(edge: number) {
		const newZoom = camera.right / (edge + camera.position.x + camera.position.y + buffer);

		camera.zoom = Math.min(newZoom, maxZoom);
		camera.updateProjectionMatrix();
	}

	const debouncedZoomToFit = debounce(() => {
		console.log('resize');
		zoomToFit(Math.abs(maze[0].position[0]));
	}, 500);

	onMount(() => {
		window.addEventListener('resize', debouncedZoomToFit);
	});

	// force update when view type changes
	configStore.subscribe((store) => {
		if (!camera) return;

		const position = store.verticalView ? view.vertical : view.ortho;
		camera.position.set(...position);
		camera.lookAt(0, 0, 0);
	});
</script>

<T.OrthographicCamera
	bind:ref={camera}
	makeDefault
	position={view.ortho}
	fov={100}
	near={-2000}
	zoom={1}
	on:create={({ ref }) => {
		ref.lookAt(0, 0, 0);
		zoomToFit(Math.abs(maze[0].position[0]));
	}}
>
	{#if $configStore.orbitControls}
		<OrbitControls maxPolarAngle={degToRad(80)} enableZoom target={[0, 0.5, 0]} />
	{/if}
</T.OrthographicCamera>
