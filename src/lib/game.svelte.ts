import { goto } from '$app/navigation';
import { getContext, setContext } from 'svelte';
import { getFromUrl, isElement } from './utils';
import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
import { browser } from '$app/environment';
import { pubs } from './pubs';

const avatarTypes = ['light', 'heavy'] as const;

type GameStateStatus = 'idle' | 'inProgress' | 'done';
type AvatarType = (typeof avatarTypes)[number];
type RigidBodyEvent = { targetRigidBody: RapierRigidBody | null };

const { publish, managedSubscriber } = pubs(['inProgress', 'done', 'restartMaze']);

class GameState {
	status = $state<GameStateStatus>('idle');
	inMaze = $state(false);
	moveAllowed = $state(true);
	avatarType = $state<AvatarType>('light');
	seed = $state<string>();
	entryTime = $state(0);
	exitTime = $state(0);
	timeCompleted = $state(0);

	constructor() {
		const config = getFromUrl(['avatar', 'maze'], new URL(location.href));

		if ((config.avatar === 'heavy' || config.avatar === 'light') && config.maze) {
			this.avatarType = config.avatar;
			this.seed = config.maze;
		} else {
			goto(`/`);
		}
	}

	goToNewGame() {
		const newSeed = Date.now().toString();
		goto(`/maze?avatar=${this.avatarType}&maze=${newSeed}`);

		this.status = 'inProgress';
		this.exitTime = 0;
		this.entryTime = Date.now();
		this.timeCompleted = 0;
		this.inMaze = false;
		this.seed = newSeed;

		publish('restartMaze');
	}

	enterMaze({ targetRigidBody }: RigidBodyEvent) {
		if (!targetRigidBody || !isElement(targetRigidBody, 'avatar') || this.inMaze) {
			return;
		}

		this.inMaze = true;
	}

	exitMaze({ targetRigidBody }: RigidBodyEvent) {
		if (!targetRigidBody || !isElement(targetRigidBody, 'avatar')) {
			return;
		}

		const now = Date.now();

		if (this.inMaze) {
			this.status = 'done';
			this.exitTime = now;
			this.timeCompleted = now - this.entryTime;
			publish('done');
		}
	}

	restartMaze() {
		this.status = 'inProgress';
		this.exitTime = 0;
		this.entryTime = Date.now();
		this.timeCompleted = 0;
		this.inMaze = false;
		publish('restartMaze');
	}

	endCountdown() {
		this.status = 'inProgress';
		this.entryTime = Date.now();
		publish('inProgress');

		setTimeout(() => {
			this.moveAllowed = true;
		}, 1000);
	}
}

const CONTEXT_KEY = Symbol('gameState');

export function initGameState() {
	return setContext(CONTEXT_KEY, new GameState());
}

export function getGameState() {
	return {
		store: getContext<ReturnType<typeof initGameState>>(CONTEXT_KEY),
		...managedSubscriber()
	};
}
