// Adapted from https://github.com/codebox/maze.js

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { METADATA_UNPROCESSED_CELL, METADATA_CURRENT_CELL, METADATA_VISITED } from './constants.js';

function markAsVisited(cell) {
	cell.metadata[METADATA_VISITED] = true;
}

function isVisited(cell) {
	return cell.metadata[METADATA_VISITED];
}

function isUnvisited(cell) {
	return !isVisited(cell);
}

function algorithmProgress(grid) {
	let previousCells;

	grid.forEachCell((cell) => (cell.metadata[METADATA_UNPROCESSED_CELL] = true));

	return {
		step(...cells) {
			this.current(...cells);
			cells.forEach((cell) => delete cell.metadata[METADATA_UNPROCESSED_CELL]);
		},
		current(...cells) {
			(previousCells || []).forEach(
				(previousCell) => delete previousCell.metadata[METADATA_CURRENT_CELL]
			);
			cells.forEach((cell) => (cell.metadata[METADATA_CURRENT_CELL] = true));
			previousCells = cells;
		},
		finished() {
			(previousCells || []).forEach(
				(previousCell) => delete previousCell.metadata[METADATA_CURRENT_CELL]
			);
		}
	};
}

export function recursiveBacktrackAlgorithm(grid) {
	const stack = [];
	const progress = algorithmProgress(grid);
	let currentCell;

	function visitCell(nextCell) {
		const previousCell = currentCell;
		currentCell = nextCell;
		markAsVisited(currentCell);
		if (previousCell) {
			grid.link(currentCell, previousCell);
		}
		stack.push(currentCell);
	}

	const startCell = grid.randomCell();
	visitCell(startCell);
	progress.step(startCell);

	while (stack.length) {
		const nextCell = currentCell.neighbours.random(isUnvisited);
		if (nextCell) {
			visitCell(nextCell);
		} else {
			while (!currentCell.neighbours.random(isUnvisited)) {
				stack.pop();
				if (!stack.length) {
					break;
				}
				currentCell = stack[stack.length - 1];
			}
		}
		progress.step(currentCell);
	}
	progress.finished();
}
