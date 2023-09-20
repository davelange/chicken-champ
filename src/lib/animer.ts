import { useFrame } from '@threlte/core';
import { writable, type Writable } from 'svelte/store';
import type { RigidBody as RapierRigidBody, Rotation, Vector } from '@dimforge/rapier3d-compat';
import { ease, type Easing } from '$lib/easing';
import { Euler, Object3D, Vector3, Vector4 } from 'three';
import { deepRound } from '$lib/utils';
//import { useAnimers } from './useAnimers';

type Axes<T> = {
	x: T;
	y: T;
	z: T;
};
type AnimationOptions = {
	type?: 'translate' | 'rotate';
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
	body3D: Object3D | undefined;
	pool: Animation[];
	id: number;
	rotationTrack: Rotation | Euler;
	translateTrack: Vector;
};
export type AnimerStore = Writable<AnimerWritableStore> & {
	go: (options: AnimationOptions[]) => void;
	setBody: (options: { body?: RapierRigidBody; body3D?: Object3D }) => void;
	skip: (name: string) => void;
	stop: () => void;
};

export function animer() {
	const animerStore = writable<AnimerWritableStore>({
		inMotion: false,
		body: undefined,
		body3D: undefined,
		pool: [],
		id: 0,
		rotationTrack: new Vector4(0, 0, 0),
		translateTrack: new Vector3(0, 0, 0)
	});

	let ref: AnimerWritableStore;
	animerStore.subscribe((val) => (ref = val));

	const wrapStore = (): AnimerStore => {
		function setBody(options: { body?: RapierRigidBody; body3D?: Object3D }) {
			if (!options.body && !options.body3D) return;

			animerStore.update((st) => {
				if (options.body3D) {
					st.body3D = options.body3D;
				} else {
					st.body = options.body;
				}

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
					acc: { x: 0, y: 0, z: 0 },
					type: options.type || 'translate'
				};

				if (options.type === 'rotate') {
					if (ref.body) {
						st.rotationTrack = ref.body.rotation();
					} else if (ref.body3D) {
						st.rotationTrack = ref.body3D.rotation;
					}
				} else if (options.type === 'translate') {
					if (ref.body) {
						st.translateTrack = ref.body.translation();
                        console.log(st.translateTrack)
					} else if (ref.body3D) {
						st.translateTrack = ref.body3D.position;
					}
				}

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
				st.pool.forEach((item) => {
					if (item.onEnd) item.onEnd();
				});
				st.pool = [];

				return st;
			});
		}

		function skip(name: string) {
			let next: AnimationOptions | undefined;

			animerStore.update((st) => {
				st.pool = st.pool.filter((item) => {
					if (item.name === name) {
						next = item.next;
						item?.onEnd && item.onEnd();
						return false;
					}

					return true;
				});

				return st;
			});

			if (next) addAnimToPool(next);
		}

		useFrame(() => {
			if (!ref.inMotion || (!ref?.body && !ref?.body3D)) {
				return;
			}

			let applyTranslation = false;
			let applyRotation = false;

			for (let i = 0; i < ref.pool.length; i++) {
				const anim = ref.pool[i];
				const progressDecimal = (anim.frame * 100) / anim.duration / 100;
				const axes = Object.keys(anim.force) as ['x', 'y', 'z'];

				for (const ax of axes) {
					if (!ax) return;

					const easedVal = ease(anim.easing?.[ax], progressDecimal);

					const frEase = easedVal - anim.acc[ax];
					anim.acc[ax] = anim.acc[ax] + frEase;

					switch (anim.type) {
						case 'translate':
							applyTranslation = true;

							ref.translateTrack[ax] += frEase * (anim.force[ax] || 0);

							break;

						case 'rotate':
							applyRotation = true;

							ref.rotationTrack[ax] += deepRound(frEase * (anim.force[ax] || 0));

							break;
					}
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

			if (applyRotation) {
				if (ref.body) {
					ref.body.setRotation(ref.rotationTrack as Rotation, true);
				} else if (ref.body3D) {
					ref.body3D?.rotation.set(ref.rotationTrack.x, ref.rotationTrack.y, ref.rotationTrack.z);
				}
			}

			if (applyTranslation) {
				if (ref.body) {
					ref.body.setTranslation(ref.translateTrack, true);
				} else if (ref.body3D) {
					ref.body3D.position.set(ref.translateTrack.x, ref.translateTrack.y, ref.translateTrack.z);
				}
			}

			animerStore.set(ref);
		});

		return {
			...animerStore,
			go,
			setBody,
			stop,
			skip
		};
	};

	const store = wrapStore();

	//useAnimers.add(name, store);

	return { ...animerStore, ...store };
}
