import { writable } from 'svelte/store';
import { Vector3 as RapierVector3 } from '@dimforge/rapier3d-compat';
import { pubs } from './pubs';
import { getContext, setContext } from 'svelte';
import { getGameState } from './game.svelte';

const { managedSubscriber, publish } = pubs(['reset']);

class AvatarState {
	fallen = $state(false);
	lastSafePosition = $state(new RapierVector3(0, 0, 0));

	constructor() {
		getGameState().on('restartMaze', () => {
			this.fallen = false;
		});
	}

	resetPose() {
		publish('reset');
	}
}

const CONTEXT_KEY = Symbol('avatarState');

export function initAvatarState() {
	return setContext(CONTEXT_KEY, new AvatarState());
}

export function getAvatarState() {
	return {
		store: getContext<ReturnType<typeof initAvatarState>>(CONTEXT_KEY),
		...managedSubscriber()
	};
}
