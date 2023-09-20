type PossibleKey = 'w' | 'a' | 's' | 'd' | 'Space' | 'r';
type KeyMap = Partial<Record<PossibleKey, boolean>>;
type Subscriber = (map: KeyMap) => void;

export type KeyQueue = {
	subs: Subscriber[];
	map: KeyMap;
	lockMap: KeyMap;
	pending: boolean;
	interval: number;

	publish: () => void;
	subscribe: (fn: Subscriber) => void;
	add: (key: PossibleKey) => void;
	remove: (key: PossibleKey) => void;
	handleKeyDown: (event: KeyboardEvent) => void;
	handleKeyUp: (event: KeyboardEvent) => void;
	init: () => void;
	destroy: () => void;
};

export const keyq: KeyQueue = {
	interval: 50,
	subs: [],

	publish() {
		this.subs.forEach((fn) => {
			fn(this.map);
		});
	},

	subscribe(fn) {
		this.subs.push(fn);
	},

	pending: false,
	map: {},
	lockMap: {},

	add(key) {
		if (this.lockMap[key]) {
			return;
		}

		this.map[key] = true;
		this.lockMap[key] = true;

		if (!this.pending) {
			setTimeout(() => {
				this.pending = false;
				this.publish();
			}, 60);

			this.pending = true;
		}
	},

	remove(key) {
		delete this.map[key];
		delete this.lockMap[key];

		if (!this.pending) {
			setTimeout(() => {
				this.pending = false;
			}, 60);

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
