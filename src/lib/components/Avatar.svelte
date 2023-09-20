<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { Collider, RigidBody } from '@threlte/rapier';
	import { Vector3, Vector4 } from 'three';
	import AvatarModel from './AvatarModel.svelte';
	import { keyq, type KeyQueue } from '$lib/keyq';
	import { animer } from '$lib/animer';
	import avatar from '$lib/avatar';

	export let initialPosition = [-40, 0, 0] as [x: number, y: number, z: number];

	let direction = { x: 0, y: 0, z: 0 };
	let moveBy = 3;

	let anim = animer();
	let { scene } = useThrelte();

	// init stuff
	$: if ($avatar.tracker && $avatar.rigidBody) {
		console.log($avatar.rigidBody);

		anim.setBody({
			body: $avatar.rigidBody
		});
		$avatar.tracker.position.set(...initialPosition);
		scene.add($avatar.tracker);
	}

	function move(map: KeyQueue['map']) {
		if (!$avatar.tracker) return;

		let pos = $avatar.rigidBody.translation();

		$avatar.tracker.position.lerp(new Vector3(pos.x, pos.y, pos.z), 0.01);

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
					force: { y: -1 },
					duration: 15,
					easing: { y: 'easeOutBounce' }
				}
			}
		]);
	}

	function handleKey(map: KeyQueue['map']) {
		if (
			(!map.w && !map.a && !map.s && !map.d && !map.r) ||
			!$avatar?.rigidBody ||
			!$avatar.tracker
		) {
			return;
		}

		if (map.r) {
			$avatar.rigidBody.setRotation(new Vector4(0, 0, 0), true);

			anim.go([
				{
					force: { y: 10 },
					duration: 40,
					easing: { y: 'easeOutQuint' },
					next: {
						force: { y: -10 },
						duration: 60,
						easing: { y: 'easeOutQuint' }
						/* onEnd: () => (fallen = false) */
					}
				}
			]);

			return;
		}

		/* if (fallen) {
			return;
		}

		if ($anim.inMotion) {
			queuedKeystroke = { ...map };

			return;
		} */

		move(map);
	}

	keyq.subscribe(handleKey);
</script>

<T.Group position={initialPosition}>
	<RigidBody
		type="dynamic"
		bind:rigidBody={$avatar.rigidBody}
		gravityScale={4}
		enabledRotations={[true, false, true]}
		userData={{ name: 'avatar' }}
	>
		<T.Group position={[0, 1.8, 0]}>
			<Collider sensor shape="cuboid" args={[0.8, 0.2, 0.8]} />
		</T.Group>
		<Collider mass={1} shape="cuboid" args={[0.8, 1.8, 0.8]} contactForceEventThreshold={2} />
		<AvatarModel output={direction} />
		<T.Mesh bind:mesh={$avatar.tracker} castShadow scale={[1, 1, 1]} position={initialPosition} />
	</RigidBody>
</T.Group>
