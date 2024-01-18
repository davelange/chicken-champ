<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import AvatarRadioButton from '$lib/components/ui/AvatarRadioButton.svelte';

	let seedParam = $page.url.searchParams.get('seed');
	let defaultSeed = seedParam || Date.now();
	let animRX = 15;
	$: isSeedRandom = !seedParam;

	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		interval = setInterval(() => {
			animRX = animRX * -1;
		}, 1200);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<form
	action="/maze"
	class="flex flex-col gap-8 max-w-[90vw] mx-auto"
	style="--anim-r-x: {animRX}deg"
>
	<h2 class="">Choose your chicken</h2>
	<div class="flex gap-8 flex-wrap justify-center">
		<AvatarRadioButton type="light" />
		<AvatarRadioButton type="heavy" />
	</div>

	<div class="flex flex-col gap-4">
		<label for="heavy">Maze seed {isSeedRandom ? '(random)' : ''}</label>
		<input
			type="string"
			name="seed"
			bind:value={defaultSeed}
			id="seed"
			class="bg-zinc-800 px-3 py-1 text-zinc-100 text-center text-sm"
		/>
	</div>

	<button type="submit" class="bg-yellow-300 text-zinc-800 px-4 py-2 rounded-md">Let's go</button>
</form>
