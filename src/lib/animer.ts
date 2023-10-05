import { useFrame } from '@threlte/core';
import { writable, type Writable } from 'svelte/store';
import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
import { ease, type Easing } from '$lib/easing';
import type { Axes } from '../types';

type AnimationOptions = {
	force: Partial<Axes<number>>;
	duration: number;
	easing?: Partial<Axes<Easing>>;
	next?: AnimationOptions;
	name?: string;
	onEnd?: () => void;
};
type Animation = AnimationOptions & {
	id: number;
	acc: { x: number; y: number; z: number };
	frame: number;
};
type AnimerWritableStore = {
	inMotion: boolean;
	body: RapierRigidBody | undefined;
	pool: Animation[];
	id: number;
};
export type AnimerStore = Writable<AnimerWritableStore> & {
	go: (options: AnimationOptions[]) => void;
	create: (options: { body?: RapierRigidBody }) => void;
	skip: (
		name: string,
		options?: {
			kill: boolean;
		}
	) => void;
	stop: () => void;
};

export function animer() {
	const animerStore = writable<AnimerWritableStore>({
		inMotion: false,
		body: undefined,
		pool: [],
		id: 0
	});

	let ref: AnimerWritableStore;
	animerStore.subscribe((val) => (ref = val));

	const wrapStore = (): AnimerStore => {
		function create(options: { body?: RapierRigidBody }) {
			if (!options.body) return;

			animerStore.update((st) => {
				st.body = options.body;

				return st;
			});
		}

		function addAnimToPool(options: AnimationOptions) {
			animerStore.update((st) => {
				const id = st.id + 1;
				const anim: Animation = {
					...options,
					id,
					frame: 1,
					acc: { x: 0, y: 0, z: 0 }
				};

				st.pool.push(anim);
				st.id = id;

				return st;
			});
		}

		function go(options: AnimationOptions[]) {
			options.forEach((item) => {
				addAnimToPool(item);
			});

			animerStore.update((st) => {
				st.inMotion = true;

				return st;
			});
		}

		function stop() {
			animerStore.update((st) => {
				st.pool = [];
				st.inMotion = false;
				return st;
			});
		}

		function skip(
			name: string,
			options?: {
				kill: boolean;
			}
		) {
			let next: AnimationOptions | undefined;

			animerStore.update((st) => {
				st.pool = st.pool.filter((item) => {
					if (item.name === name) {
						if (!options?.kill) {
							next = item.next;
							item?.onEnd && item.onEnd();
						}

						return false;
					}

					return true;
				});

				if (!st.pool.length && !next) {
					st.inMotion = false;
				}

				return st;
			});

			if (next) {
				addAnimToPool(next);
			}
		}

		useFrame(() => {
			if (!ref.inMotion || !ref?.body) {
				return;
			}

			const currentTranslation = ref.body.translation();

			for (let i = 0; i < ref.pool.length; i++) {
				const anim = ref.pool[i];
				const progressDecimal = (anim.frame * 100) / anim.duration / 100;
				const axes = Object.keys(anim.force) as ['x', 'y', 'z'];

				for (const ax of axes) {
					if (!ax) return;

					const easedVal = ease(anim.easing?.[ax], progressDecimal);

					const frEase = easedVal - anim.acc[ax];
					anim.acc[ax] = anim.acc[ax] + frEase;

					currentTranslation[ax] += frEase * (anim.force[ax] || 0);
				}

				if (anim.frame === anim.duration) {
					if (ref.pool.length === 1 && !ref.pool[0].next) {
						ref.inMotion = false;
					}

					if (anim.next) {
						addAnimToPool(anim.next);
					}

					if (anim.onEnd) {
						anim.onEnd();
					}

					ref.pool = ref.pool.filter((item) => item.id !== anim.id);
				}

				anim.frame++;
			}

			ref.body.setTranslation(currentTranslation, true);

			animerStore.set(ref);
		});

		return {
			...animerStore,
			go,
			create,
			stop,
			skip
		};
	};

	const store = wrapStore();

	return { ...animerStore, ...store };
}
