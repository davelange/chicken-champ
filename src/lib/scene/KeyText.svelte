<script lang="ts">
	import { Text } from '@threlte/extras';
	import { FULL_ROTATION } from '$lib/utils';

	export let text: string;
</script>

<Text
	{text}
	characters={text}
	position={[0, 1.2, 0]}
	color="#333"
	fontSize={4}
	fontWeight="bold"
	rotation={[-FULL_ROTATION / 4, 0, FULL_ROTATION / 4]}
	anchorX="center"
	anchorY="middle"
	textAlign="center"
	font="/fonts/IBMPlexMono-Medium.ttf"
/>
