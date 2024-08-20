<script lang="ts">
	import { getConfig } from '$lib/config.svelte';
	import { getGameState } from '$lib/game.svelte';

	let config = getConfig();
	let { store: gameState } = getGameState();
	let open = $state(false);

	function handleKeyUp(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			open = false;
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="root"
	onkeyup={handleKeyUp}
	style="color: {config.mazeColor}; background: {config.floorColor}"
>
	<button type="button" class="toggle-btn" onclick={() => (open = !open)}>
		{open ? 'Close' : 'Settings'}
	</button>
	{#if open}
		<form class="form">
			<label>
				<input type="checkbox" bind:checked={config.worldDebug} />
				Physics world debug
			</label>
			<label>
				<input type="checkbox" bind:checked={config.axes} />
				Show axes
			</label>
			<label>
				<input type="checkbox" bind:checked={config.floorGrid} />
				Show floor grid
			</label>
			<label>
				<input type="checkbox" bind:checked={config.verticalView} />
				Vertical camera view
			</label>
			<label>
				<input type="checkbox" bind:checked={config.orbitControls} />
				Allow orbit controls
			</label>
			<label>
				<input type="checkbox" bind:checked={config.shadowLight} />
				Show shadow light guide
			</label>
			<label>
				<input type="color" bind:value={config.mazeColor} />
				Maze color
			</label>
			<label>
				<input type="color" bind:value={config.floorColor} />
				Floor color
			</label>
			<button type="button" onclick={() => gameState.restartMaze()}> Restart </button>
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
