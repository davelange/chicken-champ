// Adapted from https://github.com/codebox/maze.js

import type { buildBaseGrid } from './baseGrid';
import {
	DIRECTION_EAST,
	DIRECTION_NORTH,
	DIRECTION_SOUTH,
	DIRECTION_WEST,
	METADATA_END_CELL,
	METADATA_START_CELL
} from './constants';

type MazeGrid = ReturnType<typeof buildBaseGrid>;

function findHorizontalExits(grid: MazeGrid) {
	const centerY = Math.round(grid.metadata.height / 2) - 1;
	let minX = Number.MAX_VALUE,
		maxX = Number.MIN_VALUE;
	grid.forEachCell((cell: any) => {
		const [x, y] = cell.coords;
		if (y === centerY) {
			minX = Math.min(minX, x);
			maxX = Math.max(maxX, x);
		}
	});
	grid.getCellByCoordinates(minX, centerY).metadata[METADATA_START_CELL] = DIRECTION_WEST;
	grid.getCellByCoordinates(maxX, centerY).metadata[METADATA_END_CELL] = DIRECTION_EAST;

	return grid;
}

export function generateMeshData(inputGrid: MazeGrid, unit: number) {
	const grid = findHorizontalExits(inputGrid);
	const sideCount = Math.sqrt(grid.cellCount);

	let entrance: Triplet = [0, 0, 0];
	let exit: Triplet = [0, 0, 0];

	const blocks: MazeBlock[] = [];
	const unitOffset = unit / 2;
	let colIdx = 0;
	let rowIdx = 0;

	grid.forEachCell((cell: any) => {
		const northNeighbour = cell.neighbours[DIRECTION_NORTH];
		const southNeighbour = cell.neighbours[DIRECTION_SOUTH];
		const eastNeighbour = cell.neighbours[DIRECTION_EAST];
		const westNeighbour = cell.neighbours[DIRECTION_WEST];
		const exitDirection = cell.metadata[METADATA_START_CELL] || cell.metadata[METADATA_END_CELL];

		if (exitDirection === DIRECTION_WEST) {
			entrance = [colIdx * unitOffset * unit - unit, 0, rowIdx * unitOffset * unit - unit];
		}

		if (exitDirection === DIRECTION_EAST) {
			exit = [colIdx * unitOffset * unit + unit, 0, rowIdx * unitOffset * unit - unit];
		}

		/* Check if it has NORTH neighbour */
		if (
			(!northNeighbour || !cell.isLinkedTo(northNeighbour)) &&
			!(exitDirection === DIRECTION_NORTH)
		) {
			blocks.push({
				dimension: [unit * unitOffset, 3, unit],
				position: [
					colIdx * unitOffset * unit - unit / 2,
					0,
					rowIdx * unitOffset * unit - unit * unitOffset
				],
				color: 'red'
			});
		}

		/* Check if it has SOUTH neighbour */
		if (
			(!southNeighbour || !cell.isLinkedTo(southNeighbour)) &&
			!(exitDirection === DIRECTION_SOUTH) &&
			rowIdx === sideCount - 1
		) {
			blocks.push({
				dimension: [unit * unitOffset, 3, unit],
				position: [colIdx * unitOffset * unit - unit / 2, 0, rowIdx * unitOffset * unit],
				color: 'yellow'
			});
		}

		/* Check if it has EAST neighbour */
		if (
			(!eastNeighbour || !cell.isLinkedTo(eastNeighbour)) &&
			!(exitDirection === DIRECTION_EAST) &&
			colIdx === sideCount - 1
		) {
			blocks.push({
				dimension: [unit, 3, unit * 3],
				position: [colIdx * unitOffset * unit + unit, 0, rowIdx * unitOffset * unit - unit],
				color: 'lightseagreen'
			});
		}

		/* Check if it has WEST neighbour */
		if (
			(!westNeighbour || !cell.isLinkedTo(westNeighbour)) &&
			!(exitDirection === DIRECTION_WEST)
		) {
			blocks.push({
				dimension: [unit, 3, unit * 3],
				position: [colIdx * unitOffset * unit - unit, 0, rowIdx * unitOffset * unit - unit],
				color: 'blue'
			});
		}

		if (rowIdx === sideCount - 1) {
			rowIdx = 0;
			colIdx++;
		} else {
			rowIdx++;
		}
	});

	return { maze: blocks, entrance: entrance, exit };
}
