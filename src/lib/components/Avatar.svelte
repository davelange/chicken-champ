<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import {
		type RigidBody as RapierRigidBody,
		Vector3 as RapierVector3
	} from '@dimforge/rapier3d-compat';
	import { Collider, RigidBody } from '@threlte/rapier';
	import { Vector3, Quaternion } from 'three';
	import AvatarModel from './AvatarModel.svelte';
	import { keyq, type KeyMap, type KeyState } from '$lib/keyq';
	import { animer } from '$lib/animer';
	import type { AvatarPhysicalState, Axes, Triplet } from '../../types';
	import { avatarTracker } from '$lib/avatarTracker';
	import { onMount } from 'svelte';
	import {
		anyExceeds,
		checkOrientation,
		getAdjustedRotation,
		isElement,
		snapToGrid
	} from '$lib/utils';
	import { FALL_THRESHOLD, avatarConfigs, resetMotion } from '$lib/config/avatar';
	import { configStore } from '$lib/config';
	import { swipe } from '$lib/swipe';

	export let initialPosition: Triplet;

	$: config = avatarConfigs[$configStore.avatarConfig];

	let rigidBody: RapierRigidBody;
	let fallen = false;
	let qdKeystroke: Axes<number> | undefined = undefined;
	let physicalState: AvatarPhysicalState = 'idle';
	let lastSafePosition = new RapierVector3(...initialPosition);

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
		const currentRot = rigidBody.rotation();

		// D
		if (checkOrientation(force, 'x', 'pos')) {
			rigidBody.setRotation(getAdjustedRotation(currentRot, 'xPos'), true);

			return;
		}

		// W
		if (checkOrientation(force, 'x', 'neg')) {
			rigidBody.setRotation(getAdjustedRotation(currentRot, 'xNeg'), true);

			return;
		}

		// A
		if (checkOrientation(force, 'z', 'neg')) {
			rigidBody.setRotation(getAdjustedRotation(currentRot, 'zNeg'), true);

			return;
		}

		// Z
		if (checkOrientation(force, 'z', 'pos')) {
			rigidBody.setRotation(getAdjustedRotation(currentRot, 'zPos'), true);

			return;
		}
	}

	function getForceFromKey(map: KeyMap) {
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

	async function handleKey(map: KeyMap, state: KeyState) {
		if (map.r && fallen && state === 'keyDown') {
			const closest = snapToGrid(lastSafePosition, 4);
			rigidBody.setRotation(new Quaternion(0, 0, 0), true);
			rigidBody.setTranslation(closest, true);

			anim.go(
				resetMotion({
					onEnd: () => {
						fallen = false;
					}
				})
			);

			return;
		}

		if ((!map.w && !map.a && !map.s && !map.d) || !rigidBody || !$avatarTracker || fallen) {
			return;
		}

		if (state === 'keyDown') {
			physicalState = 'crouch';

			return;
		}

		physicalState = 'idle';

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
		if (isElement(targetRigidBody, 'floor') && !fallen) {
			lastSafePosition = rigidBody.worldCom();
		}

		const { x, z } = rigidBody.rotation();

		if (anyExceeds([x, z], FALL_THRESHOLD)) {
			fallen = true;
		}
	}

	keyq.subscribe(handleKey);
	swipe.subscribe((data) => {
		handleKey(data, 'keyUp');
	});
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
		<Collider
			mass={1}
			shape="cuboid"
			args={[1.5, 1.8, 1]}
			contactForceEventThreshold={config.contactForceEventThreshold}
			restitution={config.restitution}
			on:collisionenter={handleMainCollisionEnter}
		/>
		<AvatarModel {physicalState} />
	</RigidBody>
</T.Group>
