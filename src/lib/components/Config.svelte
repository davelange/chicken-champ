<script lang="ts">
	import { configStore } from '$lib/config';

	let open = false;

	function handleKeyUp(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			open = false;
		}
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="root"
	on:keyup={handleKeyUp}
	style="color: {$configStore.mazeColor}; background: {$configStore.floorColor}"
>
	<button type="button" class="toggle-btn" on:click={() => (open = !open)}>
		{open ? 'Close' : 'Settings'}
	</button>
	{#if open}
		<form class="form">
			<label>
				<input type="checkbox" bind:checked={$configStore.worldDebug} />
				Physics world debug
			</label>
			<label>
				<input type="checkbox" bind:checked={$configStore.axes} />
				Show axes
			</label>
			<label>
				<input type="checkbox" bind:checked={$configStore.floorGrid} />
				Show floor grid
			</label>
			<label>
				<input type="checkbox" bind:checked={$configStore.verticalView} />
				Vertical camera view
			</label>
			<label>
				<input type="checkbox" bind:checked={$configStore.orbitControls} />
				Allow orbit controls
			</label>
			<label>
				<input type="checkbox" bind:checked={$configStore.shadowLight} />
				Show shadow light guide
			</label>
			<label>
				<input type="color" bind:value={$configStore.mazeColor} />
				Maze color
			</label>
			<label>
				<input type="color" bind:value={$configStore.floorColor} />
				Floor color
			</label>
		</form>
	{/if}
</div>

<style>
	.root {
		position: absolute;
		top: 2rem;
		right: 2rem;
		max-width: 300px;
		border-radius: 0.5rem;
		z-index: 2;
	}
	.toggle-btn {
		background: none;
		border: 0;
		padding: 0;

		text-decoration: underline;
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
	}
	label {
		display: block;
	}
</style>
