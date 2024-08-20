import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
import type { TravelAnimationOptions } from './types';
import { Quaternion } from 'three';
import { useTask } from '@threlte/core';
import { TravelRotate, TravelTranslate } from './animations';

type TravelAnimation = TravelTranslate | TravelRotate;

export class Travel {
	inMotion = $state(false);
	body!: RapierRigidBody;
	pool: Array<TravelAnimation> = [];
	id = 0;

	constructor() {
		useTask(() => this.doFrame());
	}

	setBody(body: RapierRigidBody) {
		this.body = body;
	}

	add(item: TravelAnimation) {
		this.pool.push(item);
		this.inMotion = true;
	}

	remove(id: string) {
		this.pool = this.pool.filter((anim) => anim.id !== id);

		if (!this.pool.length) {
			this.inMotion = false;
		}
	}

	translate(options: TravelAnimationOptions<'translate'>) {
		const anim = new TravelTranslate(options, {
			body: this.body,
			remove: this.remove.bind(this),
			add: this.translate.bind(this)
		});

		this.add(anim);

		return this;
	}

	rotate(options: TravelAnimationOptions<'rotate'>) {
		const anim = new TravelRotate(options, {
			body: this.body,
			remove: this.remove.bind(this),
			add: this.rotate.bind(this)
		});

		this.add(anim);

		return this;
	}

	stopAll() {
		this.pool = [];
		this.inMotion = false;

		return this;
	}

	stop(name: string | string[]) {
		const toStop = typeof name === 'string' ? [name] : name;
		this.pool = this.pool.filter((anim) => !toStop.includes(anim.name || ''));

		if (this.pool.length === 0) {
			this.inMotion = false;
		}

		return this;
	}

	doFrame() {
		if (!this.inMotion || !this?.body) {
			return;
		}

		const { x, y, z, w } = this.body.rotation();
		const rotationAsQuaternion = new Quaternion(x, y, z, w);
		let rotateOp = {
			apply: false,
			value: rotationAsQuaternion
		};
		let translateOp = {
			apply: false,
			value: this.body.translation()
		};

		for (const anim of this.pool) {
			if (anim.type === 'translate') {
				translateOp = anim.handle(translateOp);
			} else if (anim.type === 'rotate') {
				rotateOp = anim.handle(rotateOp);
			}
		}

		if (translateOp.apply) {
			this.body.setTranslation(translateOp.value, true);
		}

		if (rotateOp.apply) {
			this.body.setRotation(rotateOp.value, true);
		}
	}
}
