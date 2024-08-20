import * as eases from 'svelte/easing';

export type Easing = keyof typeof eases;

type EaseCollection = Record<Easing, (typeof eases)[Easing]>;

export const allEases = {} as EaseCollection;
export const allEaseTypes: Easing[] = [];

let key: Easing;
for (key in eases) {
	allEases[key] = eases[key];
	allEaseTypes.push(key);
}
