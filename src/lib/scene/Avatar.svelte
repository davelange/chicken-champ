<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import {
		type RigidBody as RapierRigidBody,
		Vector3 as RapierVector3
	} from '@dimforge/rapier3d-compat';
	import { Collider, RigidBody } from '@threlte/rapier';
	import { Quaternion } from 'three';
	import { AvatarModel } from '$lib/scene';
	import { keyq, type KeyMap, type KeyState } from '$lib/keyq';
	import { animer } from '$lib/animer';
	import { avatarStore } from '$lib/avatar';
	import {
		checkOrientation,
		getAdjustedRotation,
		getForceFromKey,
		isElement,
		snapToGrid
	} from '$lib/utils';
	import { avatarConfigs } from '$lib/config/avatar';
	import { swipe } from '$lib/swipe';
	import { gameStore } from '$lib/game';

	export let initialPosition: Triplet;

	$: config = avatarConfigs[$gameStore.avatarType];

	let rigidBody: RapierRigidBody;
	let qdKeystroke: Axes<number> | undefined = undefined;
	let anim = animer();

	let { scene } = useThrelte();

	$: if (rigidBody) {
		// create animer
		anim.create({
			body: rigidBody
		});

		// init last safe position
		$avatarStore.lastSafePosition = new RapierVector3(...initialPosition);
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

	async function applyMotion(force: Axes<number>) {
		const motion = config.getWalkMotion({
			force,
			onEnd: () => {
				if (qdKeystroke) {
					applyMotion(qdKeystroke);
					qdKeystroke = undefined;
				}
			}
		});

		updateRotation(force);
		anim.go(motion);
	}

	async function handleKey(key: KeyMap, state: KeyState) {
		if (!$gameStore.moveAllowed || !rigidBody) {
			return;
		}

		// reset
		if (key.r && state === 'keyDown') {
			const closest = snapToGrid($avatarStore.lastSafePosition, 4);
			rigidBody.setRotation(new Quaternion(0, 0, 0), true);
			rigidBody.setTranslation(closest, true);

			anim.go(
				config.getResetMotion({
					onEnd: () => {
						$avatarStore.fallen = false;
					}
				})
			);

			return;
		}

		if ((!key.w && !key.a && !key.s && !key.d) || $avatarStore.fallen) {
			return;
		}

		if (state === 'keyDown') {
			$avatarStore.physicalState = 'crouch';

			return;
		}

		$avatarStore.physicalState = 'idle';

		if ($anim.inMotion) {
			// Queue max of 1 move to be played when current motion ends
			qdKeystroke = getForceFromKey({ ...key }, config.moveBy);

			return;
		}

		let force = getForceFromKey(key, config.moveBy);

		applyMotion(force);
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
		if (isElement(targetRigidBody, 'floor') && !$avatarStore.fallen) {
			$avatarStore.lastSafePosition = rigidBody.worldCom();
		}
	}

	// detect falls
	function handleHeadSensorEnter({ targetRigidBody }: { targetRigidBody: RapierRigidBody | null }) {
		if (isElement(targetRigidBody, 'floor')) {
			anim.stop();
			$avatarStore.fallen = true;
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
		<AvatarModel physicalState={$avatarStore.physicalState} />
		<T.Group position={[0, 2, 0]}>
			<Collider
				mass={0.01}
				sensor
				shape="cuboid"
				args={[1.5, 0.2, 1]}
				on:sensorenter={handleHeadSensorEnter}
			/>
		</T.Group>
	</RigidBody>
</T.Group>
