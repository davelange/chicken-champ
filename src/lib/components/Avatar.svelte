<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import { Collider, RigidBody } from '@threlte/rapier';
	import { Vector3, Vector4 } from 'three';
	import AvatarModel from './AvatarModel.svelte';
	import { keyq, type KeyQueue } from '$lib/keyq';
	import { animer, type Axes } from '$lib/animer';
	import type { Triplet } from '../../types';
	import { avatarTracker } from '$lib/avatarTracker';
	import { onMount } from 'svelte';
	import { isElement } from '$lib/utils';
	import { avatarConfigs } from '$lib/config/avatar';
	import { Easing } from '$lib/easing';

	export let initialPosition = [0, 10, 0] satisfies Triplet;

	let config = avatarConfigs.heavy;

	let rigidBody: RapierRigidBody;
	let direction: Axes<number> = { x: 0, y: 0, z: 0 };	
	let fallen = false;
	let qdKeystroke: KeyQueue['map'] | undefined = undefined;

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

	function move(map: KeyQueue['map']) {
		if (!$avatarTracker) return;

		direction = { x: 0, y: 0, z: 0 };

		if (map.w) {
			direction.z -= config.moveBy;
		} else if (map.a) {
			direction.x -= config.moveBy;
		} else if (map.d) {
			direction.x += config.moveBy;
		} else if (map.s) {
			direction.z += config.moveBy;
		}

		const motion = config.walkMotion(direction, () => {
			if (qdKeystroke) {
				move(qdKeystroke);
				qdKeystroke = undefined;
			}
			let pos = rigidBody.translation();
			avatarTracker.update(pos);
		});

		anim.go(motion);
	}

	function handleKey(map: KeyQueue['map']) {
		if (map.r && fallen) {
			rigidBody.setRotation(new Vector4(0, 0, 0), true);

			anim.go([
				{
					force: { y: 10 },
					duration: 40,
					easing: { y: Easing.OutQuint },
					next: {
						force: { y: -10 },
						duration: 60,
						easing: { y: Easing.OutCubic },
						onEnd: () => (fallen = false)
					}
				}
			]);

			return;
		}

		if ((!map.w && !map.a && !map.s && !map.d) || !rigidBody) {
			return;
		}

		if (fallen) {
			return;
		}

		if ($anim.inMotion) {
			// Queue max of 1 move to be played when current motion ends
			qdKeystroke = { ...map };

			return;
		}

		move(map);
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
		enabledRotations={[true, false, true]}
		userData={{ name: 'avatar' }}
		angularDamping={config.angularDamping}
	>
		<T.Group position={[0, 1.8, 0]}>
			<Collider
				sensor
				shape="cuboid"
				args={[0.8, 0.2, 0.8]}
				restitution={0.2}
				on:sensorenter={handleHeadCollisionEnter}
			/>
		</T.Group>
		<Collider
			mass={1}
			shape="cuboid"
			args={[0.8, 1.8, 0.8]}
			contactForceEventThreshold={config.contactForceEventThreshold}
			on:collisionenter={handleMainCollisionEnter}
		/>
		<AvatarModel output={direction} />
	</RigidBody>
</T.Group>
