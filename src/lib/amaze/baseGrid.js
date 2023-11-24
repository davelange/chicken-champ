// Adapted from https://github.com/codebox/maze.js

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { recursiveBacktrackAlgorithm } from './algorithm';
import { DIRECTION_EAST, DIRECTION_NORTH, DIRECTION_SOUTH, DIRECTION_WEST } from './constants';

export function buildBaseGrid(config) {
	const cells = {};
	const { random } = config;

	function makeIdFromCoords(coords) {
		return coords.join(',');
	}

	function buildCell(...coords) {
		const id = makeIdFromCoords(coords);
		const cell = {
			id,
			coords,
			metadata: {},
			neighbours: {
				random(fnCriteria = () => true) {
					return random.choice(this.toArray().filter(fnCriteria));
				},
				toArray(fnCriteria = () => true) {
					return Object.values(this)
						.filter((value) => typeof value !== 'function')
						.filter(fnCriteria);
				},
				linkedDirections() {
					return this.toArray()
						.filter((neighbour) => neighbour.isLinkedTo(cell))
						.map((linkedNeighbour) =>
							Object.keys(this).find((direction) => this[direction] === linkedNeighbour)
						);
				}
			},
			isLinkedTo(otherCell) {
				return this.links.includes(otherCell);
			},
			links: []
		};
		return cell;
	}

	function removeNeighbour(cell, neighbour) {
		const linkIndex = cell.links.indexOf(neighbour);
		if (linkIndex >= 0) {
			cell.links.splice(linkIndex, 1);
		}
		Object.keys(cell.neighbours)
			.filter((key) => cell.neighbours[key] === neighbour)
			.forEach((key) => delete cell.neighbours[key]);
	}

	function removeNeighbours(cell) {
		cell.neighbours.toArray().forEach((neighbour) => {
			removeNeighbour(cell, neighbour);
			removeNeighbour(neighbour, cell);
		});
	}

	return {
		forEachCell(fn) {
			Object.values(cells).forEach(fn);
		},
		link(cell1, cell2) {
			cell1.links.push(cell2);
			cell2.links.push(cell1);
		},
		metadata: config,
		randomCell(fnCriteria = () => true) {
			return random.choice(Object.values(cells).filter(fnCriteria));
		},
		addCell(...coords) {
			const cell = buildCell(...coords);
			const id = cell.id;
			console.assert(!cells[id]);
			cells[id] = cell;
			return id;
		},
		removeCell(...coords) {
			const cell = this.getCellByCoordinates(coords);
			removeNeighbours(cell);
			delete cells[cell.id];
		},
		makeNeighbours(cell1WithDirection, cell2WithDirection) {
			const cell1 = cell1WithDirection.cell;
			const cell1Direction = cell1WithDirection.direction;
			const cell2 = cell2WithDirection.cell;
			const cell2Direction = cell2WithDirection.direction;

			cell1.neighbours[cell2Direction] = cell2;
			cell2.neighbours[cell1Direction] = cell1;
		},
		getCellByCoordinates(...coords) {
			const id = makeIdFromCoords(coords);
			return cells[id];
		},
		get cellCount() {
			return Object.values(cells).length;
		}
	};
}

export function buildRandom(seed = Date.now()) {
	// https://stackoverflow.com/a/47593316/138256
	function mulberry32() {
		let t = (seed += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	}

	return {
		rnd: mulberry32,
		range(num1, num2) {
			const [min, max] = [num1, num2].sort();
			return Math.floor(min + (max - min + 1) * mulberry32());
		},
		int(rangeSize) {
			'use strict';
			console.assert(rangeSize > 0);
			return this.range(0, rangeSize - 1);
		},
		choice(array) {
			const length = array.length;
			if (length) {
				return array[this.int(length)];
			}
		},
		shuffle(array) {
			let i = array.length;

			while (i) {
				const r = this.int(i--);
				[array[i], array[r]] = [array[r], array[i]];
			}

			return array;
		},
		get seed() {
			return seed;
		}
	};
}

export function buildMazeModel(config) {
	const grid = buildBaseGrid(config);

	for (let x = 0; x < config.width; x++) {
		for (let y = 0; y < config.height; y++) {
			grid.addCell(x, y);
		}
	}
	for (let x = 0; x < config.width; x++) {
		for (let y = 0; y < config.height; y++) {
			const cell = grid.getCellByCoordinates(x, y),
				eastNeighbour = grid.getCellByCoordinates(x + 1, y),
				southNeighbour = grid.getCellByCoordinates(x, y + 1);
			if (eastNeighbour) {
				grid.makeNeighbours(
					{ cell, direction: DIRECTION_WEST },
					{ cell: eastNeighbour, direction: DIRECTION_EAST }
				);
			}
			if (southNeighbour) {
				grid.makeNeighbours(
					{ cell, direction: DIRECTION_NORTH },
					{ cell: southNeighbour, direction: DIRECTION_SOUTH }
				);
			}
		}
	}

	recursiveBacktrackAlgorithm(grid);

	return grid;
}
