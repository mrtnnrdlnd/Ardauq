<script lang="ts">
    import { MultiBlock } from "../types/MultiBlock";
    import UnitBlockComponent from "./UnitBlockComponent.svelte";

	export let block: MultiBlock;
    export let size: number;  
</script>

<div style="transform:translate({block.position.x * size}px, {block.position.y * size}px) ">
    {#each block.blocks as unitBlock}
        <UnitBlockComponent x={unitBlock.position.x * size} y={unitBlock.position.y * size} size="{size}" block={unitBlock}/>
    {/each}
</div>