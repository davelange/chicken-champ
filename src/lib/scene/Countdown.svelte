<script lang="ts">
	import { configStore } from '$lib/config';
	import { gameStore } from '$lib/game';
	import { FULL_ROTATION } from '$lib/utils';
	import { Text } from '@threlte/extras';
	import { onMount } from 'svelte';

	let time = 3;
	let timeout: ReturnType<typeof setTimeout>;
	export let onEnd: () => void;

	function runCountdown() {
		if (time === 1) {
			gameStore.countdownEnded();
			clearTimeout(timeout);
			return;
		}

		if (time === 2) {
			onEnd();
		}

		time -= 1;
		timeout = setTimeout(runCountdown, 1000);
	}

	onMount(() => {
		timeout = setTimeout(runCountdown, 1000);

		return () => {
			clearTimeout(timeout);
		};
	});
</script>

{#if time > 0}
	<Text
		text={time.toString()}
		position={[-3, 12, -32]}
		color={$configStore.mazeColor}
		fontSize={10}
		rotation={[0, -FULL_ROTATION * 2, 0]}
		anchorX="center"
		anchorY="baseline"
		textAlign="center"
		font="/fonts/IBMPlexMono-Medium.ttf"
	/>
{/if}
