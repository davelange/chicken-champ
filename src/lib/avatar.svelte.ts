import { Vector3 as RapierVector3 } from '@dimforge/rapier3d-compat';
import { pubs } from './pubs';
import { getContext, setContext } from 'svelte';
import { getGameState } from './game.svelte';
import { avatarConfigs } from './config/avatar';
import { gui } from '$lib/config.svelte';

const { managedSubscriber, publish } = pubs(['reset']);

class AvatarState {
	configs = avatarConfigs;
	fallen = $state(false);
	lastSafePosition = $state(new RapierVector3(0, 0, 0));
	jumpsRemaining = $state(3);
	config = $state(this.configs[getGameState().store.avatarType]);

	constructor() {
		getGameState().on('restartMaze', () => {
			this.fallen = false;
			this.jumpsRemaining = 3;
		});

		let avatarFolder = gui.addFolder('Avatar');
		avatarFolder.add(this.config, 'gravityScale', this.config.gravityScale).min(0).max(100);
		avatarFolder.add(this.config, 'angularDamping', this.config.angularDamping).min(0).max(100);
		avatarFolder.add(this.config, 'moveBy', this.config.moveBy).min(0).max(100);
		avatarFolder.add(this.config, 'moveByY', this.config.moveByY).min(0).max(100);
		avatarFolder.add(this.config, 'mass', this.config.mass).min(0).max(10);
		avatarFolder.add(this.config, 'restitution', this.config.restitution).min(0).max(20);
		avatarFolder.add(this.config, 'keyThrottle', this.config.keyThrottle).min(0).max(300);
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
