import { writable } from 'svelte/store';
import { Vector3 as RapierVector3 } from '@dimforge/rapier3d-compat';

type WritableStore = {
	fallen: boolean;
	physicalState: AvatarPhysicalState;
	lastSafePosition: RapierVector3;
};

export const avatarStore = writable<WritableStore>({
	fallen: false,
	physicalState: 'idle',
	lastSafePosition: new RapierVector3(0, 0, 0)
});
