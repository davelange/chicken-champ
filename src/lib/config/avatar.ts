import type { Travel } from '$lib/travel';

type MotionOptions = { force: Axes<number>; travel: Travel; onEnd?: () => void };
let F = 1;
export const RELEVANT_KEYS: string[] = ['w', 'a', 's', 'd', 'Space'];
export const FALL_THRESHOLD = 0.3;
export const avatarConfigs = {
	heavy: {
		moveBy: 47.1,
		moveByY: 76.6,
		mass: 4.22,
		angularDamping: 5,
		gravityScale: 15.2,
		restitution: 0.5,
		contactForceEventThreshold: 0.1,
		keyThrottle: 196,

		jump({
			force,
			travel,
			flipConfig,
			onEnd
		}: MotionOptions & {
			flipConfig: Partial<Axes<number>>;
		}) {
			travel
				.translate({
					name: 'jumpY1',
					by: { y: 10 },
					duration: 35 * F,
					easing: 'cubicOut',
					onEnd: () => {
						travel.body.collider(0).setEnabled(true);
						travel.translate({
							name: 'jumpY2',
							by: { y: -10 },
							duration: 25 * F,
							easing: 'bounceOut',
							onEnd
						});
					}
				})
				.translate({
					by: force,
					duration: 50 * F,
					easing: 'quartOut',
					name: 'jumpX'
				})
				.rotate({
					by: flipConfig,
					duration: 20 * F,
					name: 'jumpFlip1',
					easing: 'linear',
					onEnd() {
						travel.rotate({
							by: {
								...('x' in flipConfig && { x: flipConfig.x }),
								...('z' in flipConfig && { z: flipConfig.z })
							},
							name: 'jumpFlip2',
							duration: 20 * F,
							easing: 'linear'
						});
					}
				});
		}
	},
	light: {
		moveBy: 47.1,
		moveByY: 76.6,
		mass: 4.22,
		angularDamping: 5.5,
		gravityScale: 15.2,
		restitution: 0.5,
		contactForceEventThreshold: 0.1,
		keyThrottle: 196,

		jump({
			force,
			travel,
			flipConfig,
			onEnd
		}: MotionOptions & {
			flipConfig: Partial<Axes<number>>;
		}) {
			travel
				.translate({
					name: 'jumpY1',
					by: { y: 10 },
					duration: 35 * F,
					easing: 'cubicOut',
					onEnd: () => {
						travel.body.collider(0).setEnabled(true);
						travel.translate({
							name: 'jumpY2',
							by: { y: -10 },
							duration: 25 * F,
							easing: 'bounceOut',
							onEnd
						});
					}
				})
				.translate({
					by: force,
					duration: 50 * F,
					easing: 'quartOut',
					name: 'jumpX'
				})
				.rotate({
					by: flipConfig,
					duration: 20 * F,
					name: 'jumpFlip1',
					easing: 'linear',
					onEnd() {
						travel.rotate({
							by: {
								...('x' in flipConfig && { x: flipConfig.x }),
								...('z' in flipConfig && { z: flipConfig.z })
							},
							name: 'jumpFlip2',
							duration: 20 * F,
							easing: 'linear'
						});
					}
				});
		}
	}
};
