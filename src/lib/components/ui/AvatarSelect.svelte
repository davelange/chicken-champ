<script lang="ts">
	import { page } from "$app/stores";

	let seedParam = $page.url.searchParams.get("seed")
	let defaultSeed = seedParam || Date.now()
	$: isSeedRandom = !seedParam
</script>

<form class="form" action="/maze">
	<h2 class="heading">Choose your chicken</h2>
	<div>
		<input type="radio" name="avatarType" value="light" id="light" required />
		<label for="light">Light and shaky</label>
	</div>
	<div>
		<input type="radio" name="avatarType" value="heavy" id="heavy" required />
		<label for="heavy">Heavy and steady</label>
	</div>
	
	<div>
		<label for="heavy">Maze seed {isSeedRandom ? "(random)" : ""}</label>
		<input type="string" name="seed" bind:value={defaultSeed} id="seed" />
	</div>

	<button type="submit">Let's go</button>
</form>

<style>
	.form {
		text-align: center;
	}
</style>
