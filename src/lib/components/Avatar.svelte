<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import { Collider, RigidBody } from '@threlte/rapier';
	import { Vector3 } from 'three';
	import AvatarModel from './AvatarModel.svelte';
	import { keyq, type KeyQueue } from '$lib/keyq';
	import { animer } from '$lib/animer';
	import type { Axes, Triplet } from '../../types';
	import { avatarTracker } from '$lib/avatarTracker';
	import { onMount } from 'svelte';
	import { checkOrientation, isElement, quaternion } from '$lib/utils';
	import { avatarConfigs, resetMotion } from '$lib/config/avatar';

	export let initialPosition = [0, 10, 0] satisfies Triplet;

	let config = avatarConfigs.heavy;

	let rigidBody: RapierRigidBody;
	let fallen = false;
	let qdKeystroke: Axes<number> | undefined = undefined;
	let anim = animer();

	let { scene } = useThrelte();

	onMount(() => {
		scene.add($avatarTracker);
		avatarTracker.update(new Vector3(...initialPosition));
	});

	$: if (rigidBody) {
		anim.create({
			body: rigidBody
		});
	}

	function updateRotation(force: Axes<number>) {
		// D
		if (checkOrientation(force, 'x', 'pos')) {
			rigidBody.setRotation(quaternion.xPos, true);

			return;
		}

		// W
		if (checkOrientation(force, 'x', 'neg')) {
			rigidBody.setRotation(quaternion.xNeg, true);

			return;
		}

		// A
		if (checkOrientation(force, 'z', 'neg')) {
			rigidBody.setRotation(quaternion.zNeg, true);

			return;
		}

		// Z
		if (checkOrientation(force, 'z', 'pos')) {
			rigidBody.setRotation(quaternion.zPos, true);

			return;
		}
	}

	function getForceFromKey(map: KeyQueue['map']) {
		let direction = { x: 0, y: 0, z: 0 };

		if (map.w) {
			direction.z -= config.moveBy;
		} else if (map.a) {
			direction.x -= config.moveBy;
		} else if (map.d) {
			direction.x += config.moveBy;
		} else if (map.s) {
			direction.z += config.moveBy;
		}

		return direction;
	}

	async function move(direction: Axes<number>) {
		const motion = config.walkMotion(direction, () => {
			if (qdKeystroke) {
				updateRotation(qdKeystroke);
				move(qdKeystroke);
				qdKeystroke = undefined;
			}
			let pos = rigidBody.translation();
			avatarTracker.update(pos);
		});

		anim.go(motion);
	}

	async function handleKey(map: KeyQueue['map']) {
		if (map.r && fallen) {
			rigidBody.setRotation(quaternion.xPos, true);

			anim.go(resetMotion({ onEnd: () => (fallen = false) }));

			return;
		}

		if ((!map.w && !map.a && !map.s && !map.d) || !rigidBody || !$avatarTracker) {
			return;
		}

		if (fallen) {
			return;
		}

		if ($anim.inMotion) {
			// Queue max of 1 move to be played when current motion ends
			qdKeystroke = getForceFromKey({ ...map });

			return;
		}

		let force = getForceFromKey(map);

		updateRotation(force);
		move(force);
	}

	// stop animer motion when avatar hits wall
	function handleMainCollisionEnter({
		targetRigidBody
	}: {
		targetRigidBody: RapierRigidBody | null;
	}) {
		if (isElement(targetRigidBody, 'maze')) {
			anim.stop();
		}
	}

	// detect when heads touches floor (means avatar fell over)
	function handleHeadCollisionEnter({
		targetRigidBody
	}: {
		targetRigidBody: RapierRigidBody | null;
	}) {
		if (isElement(targetRigidBody, 'floor')) {
			fallen = true;
		}
	}

	keyq.subscribe(handleKey);
</script>

<T.Group position={initialPosition}>
	<RigidBody
		type="dynamic"
		bind:rigidBody
		gravityScale={config.gravityScale}
		enabledRotations={[true, true, true]}
		userData={{ name: 'avatar' }}
		angularDamping={config.angularDamping}
	>
		<T.Group position={[0, 1.8, 0]}>
			<Collider
				sensor
				shape="cuboid"
				args={[1.5, 0.2, 1]}
				on:sensorenter={handleHeadCollisionEnter}
			/>
		</T.Group>

		<Collider
			mass={1}
			shape="cuboid"
			args={[1.5, 1.8, 1]}
			contactForceEventThreshold={config.contactForceEventThreshold}
			restitution={0}
			on:collisionenter={handleMainCollisionEnter}
		/>

		<AvatarModel />
	</RigidBody>
</T.Group>
