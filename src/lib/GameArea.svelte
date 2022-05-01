<script lang="ts">
import MultiBlockComponent from "./components/MultiBlockComponent.svelte";
import UnitBlockComponent from "./components/UnitBlockComponent.svelte";
import { ISlot } from "./types/GameComponents";

import { GameHandler } from "./types/GameHandler";
import { MultiBlock } from "./types/MultiBlock";





    let areaWidth: number = 8;
    let areaHeight: number = 20;
    let blockSize: number = 30;

    export let paused: boolean = true;

    let gameHandler = new GameHandler(areaWidth, areaHeight);
    gameHandler.newPiece();

    let outputGameGrid: Array<Array<ISlot>> = gameHandler.gameGrid;
    let outputActiveBlock: MultiBlock = gameHandler.activeBlock;
    

    // let gameGrid = new GameGrid2(8, 20);


    // let activeBlock: MultiBlockHandler2 = new MultiBlockHandler2(gameGridHandler.gameGrid)
    // activeBlock.position = {x: 2, y: 0};


    let key;
	let keyCode;

    
    function handleKeydown(event) {

        key = event.key;
        keyCode = event.keyCode;

        if(key === 'd') {
            gameHandler.rotateActiveBlock(90);
        }
        if(key === 's') {
            gameHandler.rotateActiveBlock(180);
        }
        if(key === 'a') {
            gameHandler.rotateActiveBlock(-90);
        }

        if(key === 'k') {
            gameHandler.moveActiveBlockX(-1);
        }

        if(key === 'ö') {
            gameHandler.moveActiveBlockX(+1);
        }

        if (key === "o") {
            timer = 0;
            gameHandler.dropBlock();
        }

        outputActiveBlock = gameHandler.activeBlock;

    }

    function update(progress) {
        gameHandler.moveActiveBlockY(1);
        if (gameHandler.hasReachedStop()) {
            gameHandler.dropBlock();
        }
        
        // gameHandler = gameHandler;
    }


    let timer = 0;
    function loop(timestamp) {
        var progress = timestamp - lastRender

        outputActiveBlock = gameHandler.activeBlock;
        outputGameGrid = gameHandler.gameGrid;

        if (!paused) {
            timer += progress;

            if (timer > 500) {
                update(progress)
                timer = 0;
            }
        }
        
        // update(progress)
        // draw()

        lastRender = timestamp
        window.requestAnimationFrame(loop)
    }
    var lastRender = 0
    window.requestAnimationFrame(loop)
</script>

<svelte:window on:keydown={handleKeydown}/>




<svg style="--game-width: {areaWidth*blockSize}px; --game-height: {areaHeight*blockSize}px">
    {#each outputActiveBlock.blocks as block}
        <rect x={(outputActiveBlock.position.x + block.position.x) * blockSize} y={(outputActiveBlock.position.y + block.position.y) * blockSize} width={blockSize} height={outputGameGrid.length * blockSize} fill="#F3F3F3"/>
    {/each}
    <MultiBlockComponent block={outputActiveBlock} size={blockSize}/>
    {#each outputGameGrid as row, i}
        {#each row as slot, i}  
            {#if slot.occupied}
                <UnitBlockComponent x={slot.block.position.x * blockSize} y={slot.block.position.y * blockSize} size="{blockSize}" block={slot.block}/>
            {/if}
        {/each}
    {/each}
</svg>





<style>
	svg {
		border: 1px solid #bbb;
		width: var(--game-width);
        height: var(--game-height);
		margin: 5px auto;
	}
</style>