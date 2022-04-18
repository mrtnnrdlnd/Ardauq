<script lang="ts">

    import {FourBlock} from "../types/FourBlock";
    import UnitBlockComponent from "./UnitBlockComponent.svelte";
	export let block: FourBlock;
    export let size: number;
    
</script>

<g transform="translate({block.position.x * size} {block.position.y * size}) ">
    {#each block.blocks as unitBlock}
        <UnitBlockComponent x={unitBlock.position.x * size} y={unitBlock.position.y * size} size="{size}" block={unitBlock}/>
    {/each}
</g>

<style>

</style>