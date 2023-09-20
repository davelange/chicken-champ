<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { degToRad } from 'three/src/math/MathUtils';
</script>

<T.OrthographicCamera makeDefault position={[11, 12, 11]} fov={100} zoom={10} near={-100} far={100}>
	<OrbitControls maxPolarAngle={degToRad(80)} enableZoom target={[0, 0.5, 0]} />
</T.OrthographicCamera>
