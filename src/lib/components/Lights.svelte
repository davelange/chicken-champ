<script lang="ts">
	import { avatarTracker } from '$lib/avatarTracker';
	import { configStore } from '$lib/config';
	import { T } from '@threlte/core';
	import { CameraHelper, DirectionalLight } from 'three';
	import { DirectionalLightShadow } from 'three/src/lights/DirectionalLightShadow';

	let light = new DirectionalLight();
	let shadow = new DirectionalLightShadow();

	let d = 50;

	let x = 3;

	shadow.radius = 0.1;
	shadow.camera.left = -d;
	shadow.camera.right = d;
	shadow.camera.top = -d;
	shadow.camera.bottom = d;
	shadow.camera.near = -10;
	shadow.camera.position.set(x, 20, 10);

	const helperCamera = new CameraHelper(shadow.camera);
</script>

<T.DirectionalLight
	bind:light
	position={[3, 20, 10]}
	intensity={2}
	{shadow}
	castShadow
	target={$avatarTracker}
/>
{#if $configStore.shadowLight}
	<T is={helperCamera} />
{/if}
<T.DirectionalLight position={[-3, 20, -10]} intensity={0.7} />
<T.AmbientLight intensity={0.2} />
