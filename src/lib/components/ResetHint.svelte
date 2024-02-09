<script lang="ts">
	import { avatarStore } from '$lib/avatar';
</script>

<button
	type="button"
	class="root absolute inset-0 bottom-[10vh] h-fit m-auto w-32 text-center px-2 py-1 border border-white bg-black bg-opacity-50 rounded-md"
	on:click={() => avatarStore.publish('reset')}
>
	<p>Help!</p>
	<p class="hidden lg:block">R to reset</p>
	<p class="block lg:hidden">Click to reset</p>
</button>

<style>
	@keyframes pulse {
		from {
			filter: drop-shadow(0 0 20px #ffffff);
		}
		to {
			filter: drop-shadow(0 0 20px #ffffff00);
		}
	}

	.root {
		animation: pulse 0.7s linear infinite alternate-reverse;
	}
</style>
