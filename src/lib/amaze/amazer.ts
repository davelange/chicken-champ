// Adapted from https://github.com/codebox/maze.js

import { AxisGroup } from './axisGroup';
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

	const rows = new AxisGroup({
		count: sideCount,
		unit,
		unitOffset: 2,
		axis: 'x'
	});
	const cols = new AxisGroup({
		count: sideCount,
		unit,
		unitOffset: 2,
		axis: 'z'
	});
	let entrance: Triplet = [0, 0, 0];
	let exit: Triplet = [0, 0, 0];

	grid.forEachCell((cell: any) => {
		const northNeighbour = cell.neighbours[DIRECTION_NORTH];
		const southNeighbour = cell.neighbours[DIRECTION_SOUTH];
		const eastNeighbour = cell.neighbours[DIRECTION_EAST];
		const westNeighbour = cell.neighbours[DIRECTION_WEST];
		const exitDirection = cell.metadata[METADATA_START_CELL] || cell.metadata[METADATA_END_CELL];

		if (exitDirection === DIRECTION_WEST) {
			entrance = [
				cols.index * cols.unitOffset * cols.unit - cols.unit,
				0,
				rows.index * rows.unitOffset * rows.unit - rows.unit
			];
		}

		if (exitDirection === DIRECTION_EAST) {
			exit = [
				cols.index * cols.unitOffset * cols.unit + cols.unit,
				0,
				rows.index * rows.unitOffset * rows.unit - rows.unit
			];
		}

		/* Check if it has NORTH neighbour */
		if (
			(!northNeighbour || !cell.isLinkedTo(northNeighbour)) &&
			!(exitDirection === DIRECTION_NORTH)
		) {
			const positionToSet = cols.index * cols.unitOffset * cols.unit;

			if (rows.nextBlockIsContiguous(positionToSet)) {
				rows.onLastBlock({
					dimensionChange: rows.unit * 2,
					positionChange: rows.unit
				});
			} else {
				rows.addBlock({
					dimension: [rows.unit * rows.unitOffset, 3, rows.unit],
					position: [
						cols.index * cols.unitOffset * cols.unit,
						0,
						rows.index * rows.unitOffset * rows.unit - rows.unit * rows.unitOffset
					],
					color: 'red'
				});
			}
		}

		/* Check if it has SOUTH neighbour */
		if (
			(!southNeighbour || !cell.isLinkedTo(southNeighbour)) &&
			!(exitDirection === DIRECTION_SOUTH) &&
			rows.index === sideCount - 1
		) {
			const positionToSet = cols.index * cols.unitOffset * cols.unit;

			if (rows.nextBlockIsContiguous(positionToSet, true)) {
				rows.onLastBlock({
					dimensionChange: rows.unit * 2,
					positionChange: rows.unit,
					lastLine: true
				});
			} else {
				rows.addBlock(
					{
						dimension: [rows.unit * rows.unitOffset, 3, rows.unit],
						position: [
							cols.index * cols.unitOffset * cols.unit,
							0,
							rows.index * rows.unitOffset * rows.unit
						],
						color: 'yellow'
					},
					true
				);
			}
		}

		/* Check if it has EAST neighbour */
		if (
			(!eastNeighbour || !cell.isLinkedTo(eastNeighbour)) &&
			!(exitDirection === DIRECTION_EAST) &&
			cols.index === sideCount - 1
		) {
			const positionToSet = rows.index * rows.unitOffset * rows.unit;

			if (cols.nextBlockIsContiguous(positionToSet, true)) {
				cols.onLastBlock({
					dimensionChange: cols.unit * 2,
					positionChange: cols.unit,
					lastLine: true
				});
			} else {
				cols.addBlock(
					{
						dimension: [cols.unit, 3, cols.unit * 3],
						position: [
							cols.index * cols.unitOffset * cols.unit + cols.unit,
							0,
							rows.index * rows.unitOffset * rows.unit - rows.unit
						],
						color: 'lightseagreen'
					},
					true
				);
			}
		}

		/* Check if it has WEST neighbour */
		if (
			(!westNeighbour || !cell.isLinkedTo(westNeighbour)) &&
			!(exitDirection === DIRECTION_WEST)
		) {
			const positionToSet = rows.index * rows.unitOffset * rows.unit;

			if (cols.nextBlockIsContiguous(positionToSet)) {
				cols.onLastBlock({
					dimensionChange: cols.unit * 2,
					positionChange: cols.unit
				});
			} else {
				cols.addBlock({
					dimension: [cols.unit, 3, cols.unit * 3],
					position: [
						cols.index * cols.unitOffset * cols.unit - cols.unit,
						0,
						rows.index * rows.unitOffset * rows.unit - rows.unit
					],
					color: 'blue'
				});
			}
		}

		if (rows.index === sideCount - 1) {
			rows.index = 0;
			cols.index++;
		} else {
			rows.index++;
		}
	});

	return { maze: [...rows.getOutput(), ...cols.getOutput()], entrance: entrance, exit };
}
