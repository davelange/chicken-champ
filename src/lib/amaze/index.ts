import { generateMeshData } from './amazer';
import { buildMazeModel, buildRandom } from './baseGrid';

function sanitizeSeed(seed = "") {
	const containsNumbersOnly = !seed.match(/\D/g)
	const withinLimits = Math.abs(Number(seed)) < Number.MAX_SAFE_INTEGER

	if(withinLimits && containsNumbersOnly) {
		return Number(seed)
	}

	return Date.now()
}

export function createMaze({
	width,
	height,
	seed,
	sizeUnit
}: {
	width: number;
	height: number;
	seed?: string;
	sizeUnit: number;
}) {
	const mazeSeed = sanitizeSeed(seed)

	const mazeModel = buildMazeModel({
		width,
		height,
		random: buildRandom(mazeSeed)
	});

	return generateMeshData(mazeModel, sizeUnit);
}
