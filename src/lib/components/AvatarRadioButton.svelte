<script lang="ts">
	export let type: 'light' | 'heavy';

	$: label = type === 'light' ? 'Light and shaky' : 'Heavy and steady';
</script>

<label
	class="flex flex-col items-center justify-end gap-2 rounded-md focus-within:border-yellow-300 peer-checked:border-yellow-300 hover:border-yellow-300 py-4 peer-focus:border-yellow-300"
	for={type}
>
	<img src="/chicken_sm.png" alt={label} class="max-w-[100px] {type}" />
	<div class="flex gap-1 lg:gap-2 items-center">
		<input type="radio" name="avatarType" value={type} id={type} required class="" />
		<p>{label}</p>
	</div>
</label>

<style>
	@keyframes light {
		0% {
			translate: 0 0 0;
			rotate: 0 0 0;
			scale: 1 0.9 1;
		}
		40% {
			translate: 0 -40px 0;
			rotate: var(--anim-r-x) 0 0;
			scale: 1 1 1;
		}
		55% {
			translate: 0 0 0;
			rotate: 0 0 0;
			scale: 1 0.9 1;
		}
		60% {
			translate: 0 -8px 0;
			rotate: -10deg 0 0;
			scale: 1 1 1;
		}
		64% {
			translate: 0 0 0;
			rotate: -2deg 0 0;
			scale: 1 0.9 1;
		}
		68% {
			translate: 0 -3px 0;
			rotate: 1deg 0 0;
		}
		71% {
			translate: 0 0 0;
			rotate: 0 0 0;
		}
	}
	.light {
		animation: light 1.2s 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
	}

	@keyframes heavy {
		0% {
			translate: 0 0 0;
		}
		32% {
			translate: 0 -20px 0;
		}
		42% {
			translate: 0 0 0;
		}
		52% {
			translate: 0 -3px 0;
		}
		60% {
			translate: 0 0 0;
		}
	}

	.heavy {
		animation: heavy 1.5s 1s linear infinite;
	}
</style>
