import type { Triplet } from '../../types';

type Block = {
	position: Triplet;
	dimension: Triplet;
	color?: string;
};

type Line = {
	items: Block[];
	offset: number;
};

export class AxisGroup {
	lines: Line[];
	index = 0;
	unit: number;
	unitOffset: number;
	axis: 'x' | 'z';
	axisIndex: 0 | 2;

	constructor(config: { count: number; axis: 'x' | 'z'; unit: number; unitOffset: number }) {
		this.lines = Array.from(
			{
				length: config.count + 1
			},
			() => ({ items: [], offset: 0 })
		);
		this.axis = config.axis;
		this.axisIndex = config.axis === 'x' ? 0 : 2;
		this.unit = config.unit;
		this.unitOffset = config.unitOffset;
	}

	getCurrentLine() {
		return this.lines[this.index].items;
	}

	getOffset(lastLine = false) {
		return this.lines[lastLine ? this.lines.length - 1 : this.index].offset;
	}

	getLastBlock(lastLine = false) {
		const current = lastLine ? this.lines[this.lines.length - 1].items : this.getCurrentLine();

		return current[current.length - 1];
	}

	onLastBlock(params: { dimensionChange: number; positionChange: number; lastLine?: boolean }) {
		const current = params.lastLine
			? this.lines[this.lines.length - 1].items
			: this.getCurrentLine();
		current[current.length - 1].dimension[this.axisIndex] += params.dimensionChange;
		current[current.length - 1].position[this.axisIndex] += params.positionChange;
		this.bumpOffset(params.lastLine);
	}

	nextBlockIsContiguous(blockStart: number, lastLine = false) {
		const prevInRow = this.getLastBlock(lastLine);

		return (
			prevInRow &&
			prevInRow.position[this.axisIndex] + prevInRow.dimension[this.axisIndex] ===
				blockStart + this.getOffset(lastLine) * this.unit
		);
	}

	addBlock(block: Block, lastLine = false) {
		if (lastLine) {
			this.lines[this.lines.length - 1].items.push(block);
		} else {
			this.lines[this.index].items.push(block);
		}

		this.resetOffset(lastLine);
	}

	bumpOffset(lastLine = false) {
		this.lines[lastLine ? this.lines.length - 1 : this.index].offset++;
	}

	resetOffset(lastLine = false) {
		this.lines[lastLine ? this.lines.length - 1 : this.index].offset = 0;
	}

	getOutput() {
		return this.lines.map((line) => line.items).flat();
	}
}
