<script lang="ts">
	import { getConfig } from '$lib/config.svelte';
	import { getGameState } from '$lib/game.svelte';
	import { FULL_ROTATION } from '$lib/utils';
	import { Text } from '@threlte/extras';
	import { onMount } from 'svelte';

	let config = getConfig();
	let { store: gameState } = getGameState();

	let time = $state(1);
	let timeout = $state<ReturnType<typeof setTimeout>>();
	let { onEnd }: { onEnd: () => void } = $props();

	function runCountdown() {
		if (time === 1) {
			gameState.endCountdown();
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
		color={config.mazeColor}
		fontSize={10}
		rotation={[0, -FULL_ROTATION * 2, 0]}
		anchorX="center"
		anchorY="baseline"
		textAlign="center"
		font="/fonts/IBMPlexMono-Medium.ttf"
	/>
{/if}
