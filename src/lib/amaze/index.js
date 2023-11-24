import { generateMeshData } from './amazer';
import { buildMazeModel, buildRandom } from './baseGrid';

const mazeModel = buildMazeModel({
	width: 8,
	height: 8,
	random: buildRandom()
});

const { maze, entrance, exit } = generateMeshData(mazeModel, 4);

export { maze, entrance, exit };
