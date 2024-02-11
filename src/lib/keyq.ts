import { pubs } from './pubs';

type PossibleKey = 'w' | 'a' | 's' | 'd' | 'Space' | 'r';
export type KeyMap = Partial<Record<PossibleKey, boolean>>;
export type KeyState = 'keyDown' | 'keyUp';

const POLL_INTERVAL = 60;

type KeyQState = {
	map: KeyMap;
	lockMap: KeyMap;
	pending: boolean;
};

const state: KeyQState = {
	pending: false,
	map: {},
	lockMap: {}
};

const { publish, on, off } = pubs(['keyDown', 'keyUp']);

function add(key: PossibleKey) {
	if (state.lockMap[key]) {
		return;
	}

	state.map[key] = true;
	state.lockMap[key] = true;

	if (!state.pending) {
		setTimeout(() => {
			state.pending = false;
			publish('keyDown', state.map);
		}, POLL_INTERVAL);

		state.pending = true;
	}
}

function remove(key: PossibleKey) {
	const mapAtRelease = { ...state.map };

	delete state.map[key];
	delete state.lockMap[key];

	if (!state.pending) {
		setTimeout(() => {
			state.pending = false;
			publish('keyUp', mapAtRelease);
		}, POLL_INTERVAL);

		state.pending = true;
	}
}

function handleKeyDown(event: KeyboardEvent) {
	add(getKeyId(event));
}

function handleKeyUp(event: KeyboardEvent) {
	remove(getKeyId(event));
}

function init() {
	document.addEventListener('keydown', handleKeyDown);
	document.addEventListener('keyup', handleKeyUp);
}

function destroy() {
	document.removeEventListener('keydown', handleKeyUp);
	document.removeEventListener('keyup', handleKeyUp);
}

function getKeyId(event: KeyboardEvent): PossibleKey {
	if (event.code === 'Space') {
		return 'Space';
	}

	return event.key as PossibleKey;
}

export const keyq = {
	init,
	destroy,
	on,
	off
};
