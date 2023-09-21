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

	export let initialPosition = [0, 10, 0] satisfies Triplet;

	let rigidBody: RapierRigidBody;
	let direction = { x: 0, y: 0, z: 0 };
	let moveBy = 3;

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

		let pos = rigidBody.translation();
		avatarTracker.update(pos);

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
				type: 'translate',
				name: 'walkXZ',
				force: direction,
				duration: 30,
				easing: { x: 'easeOutSine', z: 'easeOutSine' }
			},
			{
				type: 'translate',
				name: 'walkY',
				force: { y: 1 },
				duration: 10,
				easing: { y: 'easeOutCubic' },
				next: {
					type: 'translate',
					force: { y: -1 },
					duration: 15,
					easing: { y: 'easeOutBounce' }
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
					type: 'translate',
					force: { y: 10 },
					duration: 40,
					easing: { y: 'easeOutQuint' }
				}
			]);

			return;
		}

		if ($anim.inMotion) {
			return;
		}

		move(map);
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
	>
		<T.Group position={[0, 1.8, 0]}>
			<Collider sensor shape="cuboid" args={[0.8, 0.2, 0.8]} />
		</T.Group>
		<Collider mass={1} shape="cuboid" args={[0.8, 1.8, 0.8]} contactForceEventThreshold={2} />
		<AvatarModel output={direction} />
	</RigidBody>
</T.Group>
