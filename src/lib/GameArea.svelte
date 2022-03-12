<script lang="ts">
import Block from "./components/Block.svelte";
import {TetrisBlock} from "./types/TetrisBlock"
import { ZBlock } from "./types/ZBlock";

let areaWidth: number = 300;
let areaHeight: number = areaWidth *2;
let blockSize: number = areaWidth/10;

    let blocks: TetrisBlock[] = [];

    let block1: TetrisBlock = new ZBlock();
    block1.position.x = areaWidth/2 - blockSize;
    block1.position.y = areaWidth;
    block1.rotation = 90;

    blocks.push(block1);
    
    

</script>

<div style="--game-width: {areaWidth}px; --game-height: {areaHeight}px">
    <svg>
        {#each blocks as block}
            <Block block={block} size={blockSize}/>
        {/each}
    </svg>
</div>


<style>
	svg {
		border: 1px solid black;
		width: var(--game-width);
        height: var(--game-height);
		margin: 5px auto;
	}
</style>