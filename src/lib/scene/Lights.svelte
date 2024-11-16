<script lang="ts">
	import { getConfig, gui } from '$lib/config.svelte';
	import { T } from '@threlte/core';
	import { CameraHelper, DirectionalLight } from 'three';
	import { DirectionalLightShadow } from 'three/src/lights/DirectionalLightShadow.js';

	let config = getConfig();

	$inspect(config);

	let shadow = new DirectionalLightShadow();

	let d = 80;

	let x = 3;

	shadow.radius = 0.1;
	shadow.camera.left = -d;
	shadow.camera.right = d;
	shadow.camera.top = -d;
	shadow.camera.bottom = d;
	shadow.camera.near = -10;
	shadow.camera.position.set(x, 1, -4);

	const helperCamera = new CameraHelper(shadow.camera);

	let { directionalLight1, directionalLight2 } = config.lights;
</script>

<T.DirectionalLight
	position={[
		directionalLight1.position.x,
		directionalLight1.position.y,
		directionalLight1.position.z
	]}
	rotation={[
		directionalLight1.rotation.x,
		directionalLight1.rotation.y,
		directionalLight1.rotation.z
	]}
	intensity={directionalLight1.intensity}
	{shadow}
	castShadow
/>
{#if config.shadowLight}
	<T is={helperCamera} />
{/if}
<T.DirectionalLight
	position={[
		directionalLight2.position.x,
		directionalLight2.position.z,
		directionalLight2.position.y
	]}
	rotation={[
		directionalLight2.rotation.x,
		directionalLight2.rotation.y,
		directionalLight2.rotation.z
	]}
	intensity={directionalLight2.intensity}
/>
<T.AmbientLight intensity={0.5} />
