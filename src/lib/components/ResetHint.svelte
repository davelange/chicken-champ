<div
	class="root absolute inset-0 bottom-[10vh] h-fit m-auto w-32 text-center px-2 py-1 border border-white bg-black bg-opacity-25 rounded-md"
>
	<p>Help!</p>
	<p>R to reset</p>
</div>

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
