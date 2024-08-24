<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { onMount } from 'svelte';
	import type { OrthographicCamera } from 'three';
	import { getConfig } from '$lib/config.svelte';
	import { debounce } from '$lib/utils';
	import { degToRad } from 'three/src/math/MathUtils.js';

	let config = getConfig();
	let { maze }: { maze: MazeBlock[] } = $props();
	let camera = $state<OrthographicCamera>();
	let maxZoom = 15;
	let view = $state<Record<string, Triplet>>({
		ortho: [5, 5.5, 5],
		vertical: [0, 5.5, 0]
	});

	let mazeEdge = $derived(Math.max(...maze.map((item) => item.position[0])));

	function zoomToFit() {
		if (!camera) return;

		const newZoom = camera.right / mazeEdge;

		camera.zoom = Math.min(newZoom, maxZoom);
		camera.updateProjectionMatrix();
	}

	const debouncedZoomToFit = debounce(zoomToFit, 500);

	onMount(() => {
		window.addEventListener('resize', debouncedZoomToFit);

		return () => window.removeEventListener('resize', debouncedZoomToFit);
	});

	// force update when view type changes
	$effect(() => {
		if (!camera) return;

		const position = config.verticalView ? view.vertical : view.ortho;
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
	zoom={10}
	oncreate={() => {
		camera?.lookAt(0, 0, 0);
		zoomToFit();
	}}
>
	{#if config.orbitControls}
		<OrbitControls maxPolarAngle={degToRad(80)} enableZoom target={[0, 0.5, 0]} />
	{/if}
</T.OrthographicCamera>
