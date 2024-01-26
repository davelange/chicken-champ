<script lang="ts">
	import { configStore } from '$lib/config';
	import { T, useTask } from '@threlte/core';
	import { RoundedBoxGeometry, Text } from '@threlte/extras';
	import KeyText from './KeyText.svelte';
	import { FULL_ROTATION } from '$lib/utils';
	import Countdown from '../Countdown.svelte';

	const BTN_WIDTH = 7;
	const BTN_HEIGHT = 2;
	const BTN_OFFSET = 1;
	const BTN_RADIUS = 0.05;
	const BTN_COLOR = '#eee';

	const floatSpeed = 0.01;
	const floatUpperLimit = 2;
	const floatLowerLimit = 0;

	let showBtns = true;
	let y = floatLowerLimit;
	let dir = 1; // 1 is up, -1 is down

	useTask(() => {
		if (y > floatUpperLimit) {
			dir = -1;
		} else if (y < floatLowerLimit) {
			dir = 1;
		}

		y = y + (dir === 1 ? floatSpeed : -floatSpeed);
	});
</script>

<Countdown onEnd={() => (showBtns = false)} />

{#if showBtns}
	<T.Group position={[8, 2, 6]}>
		<Text
			text="Move around"
			position={[-18, 1.2, 0]}
			color={$configStore.mazeColor}
			fontSize={3}
			rotation={[-FULL_ROTATION / 4, 0, FULL_ROTATION / 4]}
			anchorX="center"
			anchorY="center"
			textAlign="center"
			font="/fonts/IBMPlexMono-Medium.ttf"
		/>

		<T.Group position={[(BTN_WIDTH + BTN_OFFSET) * -1, y, 0]}>
			<KeyText text="W" />
			<T.Mesh scale={[BTN_WIDTH, BTN_HEIGHT, BTN_WIDTH]} castShadow receiveShadow>
				<RoundedBoxGeometry radius={BTN_RADIUS} />
				<T.MeshStandardMaterial color={BTN_COLOR} />
			</T.Mesh>
		</T.Group>

		<T.Group position={[0, y, (BTN_WIDTH + BTN_OFFSET) * -1]}>
			<KeyText text="D" />
			<T.Mesh scale={[BTN_WIDTH, BTN_HEIGHT, BTN_WIDTH]} castShadow receiveShadow>
				<RoundedBoxGeometry radius={BTN_RADIUS} />
				<T.MeshStandardMaterial color={BTN_COLOR} />
			</T.Mesh>
		</T.Group>

		<T.Group position={[0, y, BTN_WIDTH + BTN_OFFSET]}>
			<KeyText text="A" />
			<T.Mesh scale={[BTN_WIDTH, BTN_HEIGHT, BTN_WIDTH]} castShadow receiveShadow>
				<RoundedBoxGeometry radius={BTN_RADIUS} />
				<T.MeshStandardMaterial color={BTN_COLOR} />
			</T.Mesh>
		</T.Group>

		<T.Group position={[0, y, 0]}>
			<KeyText text="S" />
			<T.Mesh scale={[BTN_WIDTH, BTN_HEIGHT, BTN_WIDTH]} castShadow receiveShadow>
				<RoundedBoxGeometry radius={BTN_RADIUS} />
				<T.MeshStandardMaterial color={BTN_COLOR} />
			</T.Mesh>
		</T.Group>
	</T.Group>

	<T.Group position={[8, 2, -12]}>
		<Text
			text="Reset"
			position={[-18, 1.2, 0]}
			color={$configStore.mazeColor}
			fontSize={3}
			rotation={[-FULL_ROTATION / 4, 0, FULL_ROTATION / 4]}
			anchorX="center"
			anchorY="center"
			textAlign="center"
			font="/fonts/IBMPlexMono-Medium.ttf"
		/>
		<T.Group position={[(BTN_WIDTH + BTN_OFFSET) * -1, y, 0]}>
			<KeyText text="R" />
			<T.Mesh scale={[BTN_WIDTH, BTN_HEIGHT, BTN_WIDTH]} castShadow receiveShadow>
				<RoundedBoxGeometry radius={BTN_RADIUS} />
				<T.MeshStandardMaterial color={BTN_COLOR} />
			</T.Mesh>
		</T.Group>
	</T.Group>
{/if}
