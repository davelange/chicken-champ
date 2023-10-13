type PossibleKey = 'w' | 'a' | 's' | 'd' | 'Space' | 'r';
export type KeyMap = Partial<Record<PossibleKey, boolean>>;
export type KeyState = 'keyDown' | 'keyUp';
type Subscriber = (map: KeyMap, state: KeyState) => void;

const POLL_INTERVAL = 60;

export type KeyQueue = {
	subs: Subscriber[];
	map: KeyMap;
	lockMap: KeyMap;
	pending: boolean;

	publish: (map: KeyMap, state: KeyState) => void;
	subscribe: (fn: Subscriber) => void;
	add: (key: PossibleKey) => void;
	remove: (key: PossibleKey) => void;
	handleKeyDown: (event: KeyboardEvent) => void;
	handleKeyUp: (event: KeyboardEvent) => void;
	init: () => void;
	destroy: () => void;
};

export const keyq: KeyQueue = {
	subs: [],
	pending: false,
	map: {},
	lockMap: {},

	publish(map, keyState) {
		this.subs.forEach((fn) => {
			fn(map, keyState);
		});
	},

	subscribe(fn) {
		this.subs.push(fn);
	},

	add(key) {
		if (this.lockMap[key]) {
			return;
		}

		this.map[key] = true;
		this.lockMap[key] = true;

		if (!this.pending) {
			setTimeout(() => {
				this.pending = false;
				this.publish(this.map, 'keyDown');
			}, POLL_INTERVAL);

			this.pending = true;
		}
	},

	remove(key) {
		const mapAtRelease = { ...this.map };

		delete this.map[key];
		delete this.lockMap[key];

		if (!this.pending) {
			setTimeout(() => {
				this.pending = false;
				this.publish(mapAtRelease, 'keyUp');
			}, POLL_INTERVAL);

			this.pending = true;
		}
	},

	handleKeyDown(event: KeyboardEvent) {
		keyq.add(getKeyId(event));
	},

	handleKeyUp(event: KeyboardEvent) {
		keyq.remove(getKeyId(event));
	},

	init() {
		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);
	},

	destroy() {
		document.removeEventListener('keydown', this.handleKeyUp);
		document.removeEventListener('keyup', this.handleKeyUp);
	}
};

function getKeyId(event: KeyboardEvent): PossibleKey {
	if (event.code === 'Space') {
		return 'Space';
	}

	return event.key as PossibleKey;
}
