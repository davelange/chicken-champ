<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { OrthographicCamera } from 'three';
	import { getConfig } from '$lib/config.svelte';
	import { debounce, getZoom } from '$lib/utils';
	import { degToRad } from 'three/src/math/MathUtils.js';

	let config = getConfig();
	const scene = useThrelte();

	let camera = $state<OrthographicCamera>();
	let distance = 500;
	let view = $state<Record<string, Triplet>>({
		ortho: [distance, distance * 1.05, distance],
		vertical: [0, 5.5, 0]
	});

	function zoomToFit() {
		if (!camera) return;

		// For some reason, renderer height is not adjusting on window resize
		scene.size.current.height = window.innerHeight;
		scene.size.current.width = window.innerWidth;
		scene.renderer.setSize(window.innerWidth, window.innerHeight);
		scene.renderer.setPixelRatio(window.devicePixelRatio);

		// Adjust zoom
		camera.zoom = getZoom();
		camera.updateProjectionMatrix();
	}

	const debouncedZoomToFit = debounce(zoomToFit, 500);

	// force update when view type changes
	$effect(() => {
		if (!camera) return;

		const position = config.verticalView ? view.vertical : view.ortho;
		camera.position.set(...position);
		camera.lookAt(0, 0, 0);
	});
</script>

<svelte:window onresize={debouncedZoomToFit} />
<T.OrthographicCamera
	bind:ref={camera}
	makeDefault
	position={view.ortho}
	oncreate={() => {
		camera?.lookAt(0, 0, 0);
		zoomToFit();
	}}
>
	{#if config.orbitControls}
		<OrbitControls maxPolarAngle={degToRad(80)} enableZoom target={[0, 0.5, 0]} />
	{/if}
</T.OrthographicCamera>
