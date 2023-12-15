<script lang="ts">
	import { game } from '$lib/game';
</script>

<form class="form" action="/maze">
	<h2 class="heading">Choose your chicken</h2>
	<div>
		<input type="radio" name="avatar" value="light" id="light" />
		<label for="light">Light and shaky</label>
	</div>
	<div>
		<input type="radio" name="avatar" value="heavy" id="heavy" />
		<label for="heavy">Heavy and steady</label>
	</div>

	<button type="submit">Let's go</button>
</form>

<style>
	.form {
		text-align: center;
	}
</style>
