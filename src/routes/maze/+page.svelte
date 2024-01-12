<script lang="ts">
	import Scene from '$lib/components/Scene.svelte';
	import { game } from '$lib/game';
	import { Canvas } from '@threlte/core';
	import { onMount } from 'svelte';
</script>

<Canvas>
	<Scene />
</Canvas>