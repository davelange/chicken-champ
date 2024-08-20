<script lang="ts">
	import { T } from '@threlte/core';
	import {
		type RigidBody as RapierRigidBody,
		Vector3 as RapierVector3,
		Vector3
	} from '@dimforge/rapier3d-compat';
	import { Collider, RigidBody } from '@threlte/rapier';
	import { Quaternion } from 'three';
	import { AvatarModel } from '$lib/scene';
	import { onKey, type KeyMap, type KeyState } from '$lib/keyq';
	import {
		anyExceeds,
		checkOrientation,
		getAdjustedRotation,
		getForceFromKey,
		isElement,
		quaternion,
		snapToGrid
	} from '$lib/utils';
	import { avatarConfigs } from '$lib/config/avatar';
	import { onSwipe } from '$lib/swipe';
	import { getGameState } from '$lib/game.svelte';
	import { MAZE_POS_OFFSET } from '$lib/config/maze';
	import { onDestroy } from 'svelte';
	import { getAvatarState } from '$lib/avatar.svelte';
	import { Travel } from '$lib/travel';

	type AvatarProps = {
		initialPosition: Triplet;
	};

	let { initialPosition }: AvatarProps = $props();

	let { store: gameState, ...gameEvents } = getGameState();
	let { store: avatarState, ...avatarEvents } = getAvatarState();

	let config = $derived(avatarConfigs[gameState.avatarType]);

	let rigidBody = $state<RapierRigidBody>();
	let qdKeystroke = $state<Axes<number> | undefined>(undefined);
	let collisionLock = $state(false);
	let collisionLockTimeout: ReturnType<typeof setTimeout>;

	let keyq = onKey();
	let swipe = onSwipe();
	let travel = new Travel();

	function init() {
		travel.setBody(rigidBody!);
		// init last safe position
		avatarState.lastSafePosition = new RapierVector3(...initialPosition);
	}

	function updateRotation(force: Axes<number>) {
		const currentRot = rigidBody!.rotation();

		// D
		if (checkOrientation(force, 'x', 'pos')) {
			rigidBody!.setRotation(getAdjustedRotation(currentRot, 'xPos'), true);

			return;
		}

		// W
		if (checkOrientation(force, 'x', 'neg')) {
			rigidBody!.setRotation(getAdjustedRotation(currentRot, 'xNeg'), true);

			return;
		}

		// A
		if (checkOrientation(force, 'z', 'neg')) {
			rigidBody!.setRotation(getAdjustedRotation(currentRot, 'zNeg'), true);

			return;
		}

		// Z
		if (checkOrientation(force, 'z', 'pos')) {
			rigidBody!.setRotation(getAdjustedRotation(currentRot, 'zPos'), true);

			return;
		}
	}

	async function applyMotion(force: Axes<number>) {
		if (collisionLock) return;

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

		travel.translate(motion[0]).translate(motion[1]);
	}

	function reset() {
		const closest = snapToGrid(avatarState.lastSafePosition, 4);
		rigidBody!.setRotation(new Quaternion(0, 0, 0), true);
		rigidBody!.setTranslation(closest, true);

		travel.translate({
			by: { y: 10 },
			duration: 40,
			easing: 'quintOut',
			onEnd: () => {
				travel.translate({
					by: { y: -9 },
					duration: 40,
					easing: 'cubicOut',
					onEnd: () => (avatarState.fallen = false)
				});
			}
		});
	}

	function restartMaze() {
		rigidBody!.setTranslation(
			new Vector3(
				initialPosition[0] - MAZE_POS_OFFSET,
				rigidBody!.translation().y,
				initialPosition[2] - MAZE_POS_OFFSET
			),
			false
		);
		rigidBody!.setRotation(quaternion.xPos, true);
	}

	async function handleKey(key: KeyMap, state: KeyState) {
		if (!gameState.moveAllowed || !rigidBody || collisionLock) {
			return;
		}

		// reset
		if (key.r && state === 'keyDown') {
			avatarState.resetPose();

			return;
		}

		if ((!key.w && !key.a && !key.s && !key.d) || avatarState.fallen) {
			return;
		}

		if (state === 'keyDown') {
			avatarState.physicalState = 'crouch';

			return;
		}

		avatarState.physicalState = 'idle';

		if (travel.inMotion) {
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
	avatarEvents.on('reset', reset);
	gameEvents.on('restartMaze', restartMaze);
	keyq.on('keyDown', (data) => handleKey(data, 'keyDown'));
	keyq.on('keyUp', (data) => handleKey(data, 'keyUp'));
	swipe.on('swipe', (data) => handleKey(data, 'keyUp'));

	onDestroy(() => {
		keyq.cleanup();
		gameEvents.cleanup();
		avatarEvents.cleanup();
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
	>
		<Collider
			mass={1}
			shape="cuboid"
			args={[1.5, 1.8, 1]}
			contactForceEventThreshold={config.contactForceEventThreshold}
			restitution={config.restitution}
			oncollisionenter={handleMainCollisionEnter}
		/>
		<AvatarModel physicalState={avatarState.physicalState} />
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
