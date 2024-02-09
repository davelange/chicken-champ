import { writable } from 'svelte/store';
import { Vector3 as RapierVector3 } from '@dimforge/rapier3d-compat';

type WritableStore = {
	fallen: boolean;
	physicalState: AvatarPhysicalState;
	lastSafePosition: RapierVector3;
};

const avatarEvents = ['reset'] as const;
type AvatarEvent = (typeof avatarEvents)[number];

function createAvatarStore() {
	const store = writable<WritableStore>({
		fallen: false,
		physicalState: 'idle',
		lastSafePosition: new RapierVector3(0, 0, 0)
	});

	const eventActions: Record<AvatarEvent, undefined | (() => void)> = {
		reset: undefined
	};

	function publish(event: AvatarEvent) {
		eventActions[event]?.();
	}

	function on(event: AvatarEvent, cb: () => void) {
		eventActions[event] = cb;
	}

	return {
		...store,
		on,
		publish
	};
}

const avatarStore = createAvatarStore();

export { avatarStore };
