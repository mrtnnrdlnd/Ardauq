<!-- <svelte:options immutable/> -->
<script lang="ts">
import { Direction, IUnitBlock } from "../types/GameComponents";
    export let block: IUnitBlock;
    export let x: number;
    export let y: number;
    export let size: number;

</script>

<g transform="translate({x} {y})">
    <rect width={size} height={size} fill={block.color} />
    {#if !block.connected.includes(Direction.up)}
        <line x1="0" y1="1" x2={size} y2="1" />
    {/if}
    {#if !block.connected.includes(Direction.right)}
        <line x1={size - 1} y1="0" x2={size - 1} y2={size} />
    {/if}
    {#if !block.connected.includes(Direction.down)}
        <line x1={size} y1={size - 1} x2="0" y2={size - 1} />
    {/if}
    {#if !block.connected.includes(Direction.left)}
        <line x1="1" y1={size} x2="1" y2="0" />
    {/if}    
</g>

<style>
    line {
        stroke:white;
        stroke-width:1
    }
</style>