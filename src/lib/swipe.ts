import { neg, notNeg } from './utils';
import { pubs } from './pubs';

type Point = [x: number, y: number];

const X = 0;
const Y = 1;

type SwipeState = {
	pending: boolean;
	startPoint: Point | undefined;
	endPoint: Point | undefined;
};

const state: SwipeState = {
	pending: false,
	startPoint: undefined,
	endPoint: undefined
};

const { on, off, publish } = pubs(['swipe']);

function getDirection() {
	if (state.startPoint === undefined || state.endPoint === undefined) {
		return;
	}

	const xDiff = state.startPoint[X] - state.endPoint[X];
	const yDiff = state.startPoint[Y] - state.endPoint[Y];

	if (Math.abs(xDiff) + Math.abs(yDiff) < 10) {
		return;
	}

	if (notNeg(xDiff) && notNeg(yDiff)) {
		// 'up left';
		return { a: true };
	}

	if (notNeg(xDiff) && neg(yDiff)) {
		// 'down left';
		return { s: true };
	}

	if (neg(xDiff) && notNeg(yDiff)) {
		// 'up right';
		return { w: true };
	}

	if (neg(xDiff) && neg(yDiff)) {
		// 'down right';
		return { d: true };
	}
}

function handleTouchStart() {
	if (state.pending) {
		return;
	}

	state.startPoint = undefined;
	state.endPoint = undefined;
	state.pending = true;
}

function handleTouchEnd() {
	state.pending = false;

	const swipeDir = getDirection();

	if (swipeDir) {
		publish('swipe', swipeDir);
	}
}

function handleTouchMove(event: TouchEvent) {
	const point = event.touches?.[event.touches.length - 1];

	if (!state.startPoint) {
		state.startPoint = [point.clientX, point.clientY];
	} else {
		state.endPoint = [point.clientX, point.clientY];
	}
}

function init() {
	window.addEventListener('touchstart', handleTouchStart);
	window.addEventListener('touchmove', handleTouchMove);
	window.addEventListener('touchend', handleTouchEnd);
}

function destroy() {
	window.removeEventListener('touchstart', handleTouchStart);
	window.removeEventListener('touchmove', handleTouchMove);
	window.removeEventListener('touchend', handleTouchEnd);
}

export const swipe = {
	init,
	destroy,
	on,
	off
};
