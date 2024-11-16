<script lang="ts">
	import { T } from '@threlte/core';
	import {
		type RigidBody as RapierRigidBody,
		type Vector,
		Vector3
	} from '@dimforge/rapier3d-compat';
	import { Collider, RigidBody } from '@threlte/rapier';
	import { Quaternion } from 'three';
	import { AvatarModel } from '$lib/scene';
	import { hasKeys, onKey, type KeyMap, type KeyState } from '$lib/keyq';
	import {
		anyExceeds,
		getAdjustedRotation,
		getForceFromKeymap,
		getJumpConfig,
		getOrientationFromKeys,
		isElement,
		quaternion,
		snapToGrid,
		throttle
	} from '$lib/utils';
	import { onSwipe } from '$lib/swipe';
	import { getGameState } from '$lib/game.svelte';
	import { onDestroy } from 'svelte';
	import { getAvatarState } from '$lib/avatar.svelte';
	import { Travel } from '$lib/travel';

	type AvatarProps = {
		initialPosition: Triplet;
	};

	let { initialPosition }: AvatarProps = $props();

	let { store: gameState, ...gameEvents } = getGameState();
	let { store: avatarState, ...avatarEvents } = getAvatarState();

	let config = avatarState.config;
	let rigidBody = $state<RapierRigidBody>();
	let modelState = $state<AvatarPhysicalState>('idle');
	let qdKeystroke = $state<KeyMap | undefined>(undefined);
	let collisionLock = $state(false);
	let collisionLockTimeout: ReturnType<typeof setTimeout>;
	let startPoint = $state<Vector>();
	let orientation: Orientation = $state('xPos');

	let keyq = onKey();
	let swipe = onSwipe();
	let travel = new Travel();

	function init() {
		travel.setBody(rigidBody!);
		startPoint = rigidBody?.worldCom();
		// init last safe position
		avatarState.lastSafePosition = rigidBody!.worldCom();
	}

	async function applyWalkMotion(keys: KeyMap) {
		if (collisionLock) return;

		let force = getForceFromKeymap(keys, config.moveBy);

		rigidBody?.resetForces(true);
		rigidBody?.applyImpulse(new Vector3(force.x, config.moveByY, force.z), true);
		orientation = getOrientationFromKeys(keys);
	}

	function applyJumpMotion(keys: KeyMap) {
		if (collisionLock || !avatarState.jumpsRemaining) return;

		avatarState.jumpsRemaining--;
		rigidBody?.setGravityScale(0, true);
		rigidBody?.collider(0).setEnabled(false);

		let force = getForceFromKeymap(keys, 8);
		orientation = getOrientationFromKeys(keys);

		config.jump({
			force,
			travel,
			flipConfig: getJumpConfig(orientation),
			onEnd() {
				rigidBody?.setGravityScale(config.gravityScale, true);
			}
		});
	}

	function onReset() {
		const closest = snapToGrid(avatarState.lastSafePosition, 4);
		rigidBody!.setRotation(new Quaternion(0, 0, 0), true);
		closest.y = 4;
		rigidBody!.setTranslation(closest, true);
		avatarState.fallen = false;
	}

	function onRestartMaze() {
		if (!rigidBody || !startPoint) return;
		rigidBody.setTranslation(startPoint, true);
		rigidBody!.setRotation(quaternion.xPos, true);
	}

	async function handleKey(key: KeyMap, state: KeyState) {
		if (
			!gameState.moveAllowed ||
			!rigidBody ||
			collisionLock ||
			!hasKeys(key, ['Space', 'a', 'w', 's', 'd', 'r'])
		) {
			return;
		}

		// reset
		if (key.r && state === 'keyDown') {
			avatarState.resetPose();

			return;
		}

		if (avatarState.fallen) {
			return;
		}

		if (state === 'keyDown') {
			modelState = 'crouch';

			return;
		}

		modelState = 'idle';

		if (travel.inMotion) {
			// Queue max of 1 move to be played when current motion ends
			qdKeystroke = { ...key };

			return;
		}

		if (key.Space) {
			applyJumpMotion(key);
		} else {
			applyWalkMotion(key);
		}
	}

	// stop animer motion when avatar hits wall
	function handleMainCollisionEnter({
		targetRigidBody
	}: {
		targetRigidBody: RapierRigidBody | null;
	}) {
		// Detect if standing on maze
		if (isElement(targetRigidBody, 'maze') && rigidBody!.translation().y > 5) {
			rigidBody?.setGravityScale(config.gravityScale, true);
			travel.stopAll();
			avatarState.fallen = true;
		}

		if (isElement(targetRigidBody, 'floor') && !avatarState.fallen) {
			avatarState.lastSafePosition = rigidBody!.worldCom();

			if (anyExceeds([rigidBody!.rotation().x, rigidBody!.rotation().z], 0.3)) {
				collisionLock = true;
				clearTimeout(collisionLockTimeout);
				collisionLockTimeout = setTimeout(() => {
					collisionLock = false;
				}, 1000);
			}
		}
	}

	// detect falls
	function handleHeadSensorEnter({ targetRigidBody }: { targetRigidBody: RapierRigidBody | null }) {
		if (isElement(targetRigidBody, 'floor')) {
			travel.stopAll();
			avatarState.fallen = true;
		}
	}

	// Events
	avatarEvents.on('reset', onReset);
	gameEvents.on('restartMaze', onRestartMaze);
	keyq.on('keyDown', (a) => null);
	keyq.on(
		'keyDown',
		throttle((data) => handleKey(data, 'keyDown'), config.keyThrottle)
	);
	keyq.on(
		'keyUp',
		throttle((data) => handleKey(data, 'keyUp'), config.keyThrottle)
	);
	swipe.on('swipe', (data) => handleKey(data, 'keyUp'));

	onDestroy(() => {
		keyq.cleanup();
		gameEvents.cleanup();
		avatarEvents.cleanup();
	});

	$effect(() => {
		const current = rigidBody!.rotation();

		rigidBody!.setRotation(getAdjustedRotation(current, orientation), true);
	});
</script>

<T.Group position={[initialPosition[0], 0, initialPosition[2]]}>
	<RigidBody
		type="dynamic"
		bind:rigidBody
		gravityScale={config.gravityScale}
		enabledRotations={[true, true, true]}
		userData={{ name: 'avatar' }}
		angularDamping={config.angularDamping}
		oncreate={init}
		ccd
	>
		<Collider
			mass={config.mass}
			shape="cuboid"
			args={[1.5, 1.8, 1]}
			contactForceEventThreshold={config.contactForceEventThreshold}
			restitution={config.restitution}
			oncollisionenter={handleMainCollisionEnter}
		/>
		<AvatarModel physicalState={modelState} />
		<T.Group position={[0, 2, 0]}>
			<Collider
				mass={0.01}
				sensor
				shape="cuboid"
				args={[1.5, 0.2, 1]}
				onsensorenter={handleHeadSensorEnter}
			/>
		</T.Group>
	</RigidBody>
</T.Group>
