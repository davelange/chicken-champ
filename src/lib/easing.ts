// source: https://easings.net

export const EasingTypes = [
	'easeOutCirc',
	'easeOutBounce',
	'easeOutQuart',
	'easeInCirc',
	'easeInExpo',
	'easeOutQuad',
	'easeOutQuint',
	'easeOutCubic',
	'easeOutSine',
	'easeInSine',
	'easeInCubic'
] as const;

export type Easing = (typeof EasingTypes)[number];

export function easeOutBounce(x: number): number {
	const n1 = 7.5625;
	const d1 = 2.75;

	if (x < 1 / d1) {
		return n1 * x * x;
	} else if (x < 2 / d1) {
		return n1 * (x -= 1.5 / d1) * x + 0.75;
	} else if (x < 2.5 / d1) {
		return n1 * (x -= 2.25 / d1) * x + 0.9375;
	} else {
		return n1 * (x -= 2.625 / d1) * x + 0.984375;
	}
}

export function easeOutCirc(x: number): number {
	return Math.sqrt(1 - Math.pow(x - 1, 2));
}

export function easeOutQuart(x: number): number {
	return 1 - Math.pow(1 - x, 4);
}

export function easeInCirc(x: number): number {
	return 1 - Math.sqrt(1 - Math.pow(x, 2));
}

export function easeInExpo(x: number): number {
	return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

export function easeOutQuad(x: number): number {
	return 1 - (1 - x) * (1 - x);
}

export function easeOutQuint(x: number): number {
	return 1 - Math.pow(1 - x, 5);
}

export function easeOutCubic(x: number): number {
	return 1 - Math.pow(1 - x, 3);
}

export function easeInCubic(x: number): number {
	return x * x * x;
}

export function easeOutSine(x: number): number {
	return Math.sin((x * Math.PI) / 2);
}

export function easeInSine(x: number): number {
	return 1 - Math.cos((x * Math.PI) / 2);
}

export function linear(x: number) {
	return x;
}

export function ease(type: Easing | undefined, progressDecimal: number) {
	switch (type) {
		case 'easeOutCirc':
			return easeOutCirc(progressDecimal);

		case 'easeOutBounce':
			return easeOutBounce(progressDecimal);

		case 'easeOutQuart':
			return easeOutQuart(progressDecimal);

		case 'easeInCirc':
			return easeInCirc(progressDecimal);

		case 'easeInExpo':
			return easeInExpo(progressDecimal);

		case 'easeOutQuad':
			return easeOutQuad(progressDecimal);

		case 'easeOutQuint':
			return easeOutQuint(progressDecimal);

		case 'easeOutCubic':
			return easeOutCubic(progressDecimal);

		case 'easeInCubic':
			return easeInCubic(progressDecimal);

		case 'easeOutSine':
			return easeOutSine(progressDecimal);

		case 'easeInSine':
		default:
			return easeInSine(progressDecimal);
	}
}
