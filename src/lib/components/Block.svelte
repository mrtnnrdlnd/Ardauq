<script lang="ts">
    import {TetrisBlock} from "../types/TetrisBlock";
	export let block: TetrisBlock;
    export let size: number;
    let points: string = block.corners.map((coordinate) => coordinate.x * size + "," + coordinate.y * size).join(" ");

</script>

<g transform="translate({block.position.x} {block.position.y}) rotate({block.rotation} {block.rotationPoint.x * size} {block.rotationPoint.y * size})">
    <polygon points={points} fill={block.color} stroke="black"/>
</g>

<style>
	
</style>