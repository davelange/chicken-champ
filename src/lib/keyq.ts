type PossibleKey = 'w' | 'a' | 's' | 'd' | 'Space' | 'r';
export type KeyMap = Partial<Record<PossibleKey, boolean>>;
export type KeyState = 'keyDown' | 'keyUp';
type Subscriber = (map: KeyMap, state: KeyState) => void;

const POLL_INTERVAL = 60;

type KeyQState = {
	subs: Subscriber[];
	map: KeyMap;
	lockMap: KeyMap;
	pending: boolean;
};

const state: KeyQState = {
	subs: [],
	pending: false,
	map: {},
	lockMap: {}
};

function publish(map: KeyMap, keyState: KeyState) {
	state.subs.forEach((fn) => {
		fn(map, keyState);
	});
}

function subscribe(fn: Subscriber) {
	state.subs.push(fn);
}

function add(key: PossibleKey) {
	if (state.lockMap[key]) {
		return;
	}

	state.map[key] = true;
	state.lockMap[key] = true;

	if (!state.pending) {
		setTimeout(() => {
			state.pending = false;
			publish(state.map, 'keyDown');
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
			publish(mapAtRelease, 'keyUp');
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
	subscribe
};
