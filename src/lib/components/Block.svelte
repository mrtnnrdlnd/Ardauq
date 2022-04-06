<script lang="ts">
    import {TetrisBlock} from "../types/TetrisBlock";
	export let block: TetrisBlock;
    export let size: number;
    $: points = block.corners.map((coordinate) => coordinate.x * size + "," + coordinate.y * size).join(" ");

</script>

<g transform="translate({block.position.x * size} {block.position.y * size}) ">
    <polygon points={points} fill={block.color} stroke="black"/>
</g>

<style>

</style>

<!-- rotate({block.rotation} {block.rotationPoint.x * size} {block.rotationPoint.y * size}) -->