import type { RigidBody } from '@dimforge/rapier3d-compat';
import type { Easing } from '../easing';
import type { Travel } from '.';

export type Axis = 'x' | 'y' | 'z';

export type PartialPoint = Partial<Axes<number>>;

export type BaseTravelAnimationOptions = {
	to?: PartialPoint;
	by?: PartialPoint;
	duration: number;
	easing: Partial<Axes<Easing>> | Easing;
	name?: string;
	delay?: number;
	loop?: boolean;
	onEnd?: () => void;
};

export type TravelAnimationOptions<T extends 'translate' | 'rotate'> =
	BaseTravelAnimationOptions & {
		type?: T;
		easing: T extends 'translate' ? Partial<Axes<Easing>> | Easing : Easing;
	};

export type TravelActions = {
	body: RigidBody;
	remove: (id: string) => void;
	add: (options: any) => Travel;
};
