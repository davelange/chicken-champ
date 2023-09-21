<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import { Collider, RigidBody } from '@threlte/rapier';
	import { Vector3, Vector4 } from 'three';
	import AvatarModel from './AvatarModel.svelte';
	import { keyq, type KeyQueue } from '$lib/keyq';
	import { animer } from '$lib/animer';
	import type { Triplet } from '../../types';
	import { avatarTracker } from '$lib/avatarTracker';
	import { onMount } from 'svelte';
	import { isElement } from '$lib/utils';

	export let initialPosition = [0, 10, 0] satisfies Triplet;

	let rigidBody: RapierRigidBody;
	let direction = { x: 0, y: 0, z: 0 };
	let moveBy = 4.2;
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
			direction.z -= moveBy;
		} else if (map.a) {
			direction.x -= moveBy;
		} else if (map.d) {
			direction.x += moveBy;
		} else if (map.s) {
			direction.z += moveBy;
		}

		anim.go([
			{
				name: 'walkXZ',
				force: direction,
				duration: 35,
				easing: { x: 'easeOutSine', z: 'easeOutSine' }
			},
			{
				name: 'walkY',
				force: { y: 2 },
				duration: 15,
				easing: { y: 'easeOutCubic' },
				next: {
					force: { y: -2 },
					duration: 20,
					easing: { y: 'easeOutBounce' },
					onEnd: () => {
						if (qdKeystroke) {
							move(qdKeystroke);
							qdKeystroke = undefined;
						}
						let pos = rigidBody.translation();
						avatarTracker.update(pos);
					}
				}
			}
		]);
	}

	function handleKey(map: KeyQueue['map']) {
		if ((!map.w && !map.a && !map.s && !map.d && !map.r) || !rigidBody) {
			return;
		}

		if (map.r) {
			rigidBody.setRotation(new Vector4(0, 0, 0), true);

			anim.go([
				{
					force: { y: 10 },
					duration: 40,
					easing: { y: 'easeOutQuint' },
					next: {
						force: { y: -10 },
						duration: 60,
						easing: { y: 'easeOutCubic' },
						onEnd: () => (fallen = false)
					}
				}
			]);

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
			anim.skip('walkXZ', {
				kill: true
			});
			anim.skip('walkY', {
				kill: true
			});
		}
	}

	// detect when heads touches floor (means avatar fell over)
	function handleHeadCollisionEnter({
		targetRigidBody
	}: {
		targetRigidBody: RapierRigidBody | null;
	}) {
		if (isElement(targetRigidBody, 'floor') || isElement(targetRigidBody, 'maze')) {
			fallen = true;
		}
	}

	keyq.subscribe(handleKey);
</script>

<T.Group position={initialPosition}>
	<RigidBody
		type="dynamic"
		bind:rigidBody
		gravityScale={4}
		enabledRotations={[true, false, true]}
		userData={{ name: 'avatar' }}
		angularDamping={3}
	>
		<T.Group position={[0, 1.8, 0]}>
			<Collider
				sensor
				shape="cuboid"
				args={[0.8, 0.2, 0.8]}
				on:sensorenter={handleHeadCollisionEnter}
			/>
		</T.Group>
		<Collider
			mass={1}
			shape="cuboid"
			args={[0.8, 1.8, 0.8]}
			contactForceEventThreshold={2}
			on:collisionenter={handleMainCollisionEnter}
		/>
		<AvatarModel output={direction} />
	</RigidBody>
</T.Group>
