<script lang="ts">
import { Coordinate } from "../types/Coordinate";

import { UnitBlock } from "../types/GameGrid";

    import {TetrisBlock} from "../types/TetrisBlock";
	export let block: TetrisBlock;
    export let size: number;

    $: blockPositions = block.blocks.map((unitBlock) => [unitBlock.position.x, unitBlock.position.y])
    // $: corners = extractCorners(block.blocks)
    // $: points = extractCorners(block.blocks).map((coordinate) => coordinate.x * size + "," + coordinate.y * size).join(" ");

    // function extractCorners(block: UnitBlock) : Coordinate[] {

    //     return null;
    // }
    
</script>

<g transform="translate({block.position.x * size} {block.position.y * size}) ">
    <!-- <rect width="{size * 4}" height="{size * 4}" fill="#eee" /> -->
    {#each blockPositions as blockPosition}
        <rect x="{blockPosition[0] * size}" y="{blockPosition[1] * size}" width="{size}" height="{size}" stroke="black" stroke-width="1" fill="red" />
    {/each}
    <!-- <polygon points={points} fill={block.color} stroke="black"/> -->
</g>

<style>

</style>

<!-- rotate({block.rotation} {block.rotationPoint.x * size} {block.rotationPoint.y * size}) -->