<script lang="ts">
import MultiBlockComponent from "./components/MultiBlockComponent.svelte";
import UnitBlockComponent from "./components/UnitBlockComponent.svelte";

import { GameHandler } from "./types/GameHandler";

    let areaWidth: number = 8;
    let areaHeight: number = 20;
    let blockSize: number = 30;
     
    let gameHandler = new GameHandler(areaWidth, areaHeight);
    gameHandler.newPiece();

    let key;
    async function handleKeydown(event) {

        key = event.key;

        if(key === 'd') {
            gameHandler.rotateActiveBlock(90);
        }
        if(key === 's') {
            gameHandler.rotateActiveBlock(180);
        }
        if(key === 'a') {
            gameHandler.rotateActiveBlock(-90);
        }
        if(key === 'ArrowLeft') {
            gameHandler.moveActiveBlockX(-1);
        }
        if(key === 'ArrowRight') {
            gameHandler.moveActiveBlockX(+1);
        }
        if (key === "ArrowDown") {
            timer = 0;
            await gameHandler.dropBlock();
        }
    }

    function update(progress) {
        gameHandler.moveActiveBlockY(1);
        if (gameHandler.hasReachedStop()) {
            gameHandler.dropBlock();
        }
    }


    let timer = 0;
    function loop(timestamp) {
        var progress = timestamp - lastRender

        if (!gameHandler.gameOver) {        
            gameHandler = gameHandler;
            if (!gameHandler.paused) {
                timer += progress;

                if (timer > 500) {
                    update(progress)
                    timer = 0;
                }
            }

            lastRender = timestamp
            window.requestAnimationFrame(loop)
        }
        else {
            console.log("game over")
        }
        
    }
    var lastRender = 0
    window.requestAnimationFrame(loop)


</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="containing"><div class="score">{gameHandler.score}</div></div>
<div class="containing" style="--block-size: {blockSize}; --nr-of-columns: {areaWidth}">
    
    <div class="left">
        <div class="button" on:click={() => gameHandler.paused = !gameHandler.paused}>
            {gameHandler.paused ? "Unpause" : "Pause"} 
        </div>
        <div style="margin-top: 250px" class="button" on:click={() => gameHandler.rotateActiveBlock(90)}>
            rotate 
        </div>
        <div class="button" on:click={() => gameHandler.dropBlock()}>
            drop
        </div>
    </div>
    <div class="right">
<svg style="--game-width: {areaWidth*blockSize}px; --game-height: {areaHeight*blockSize}px">
    {#each gameHandler.activeBlock.blocks as block}
        <rect x={(gameHandler.activeBlock.position.x + block.position.x) * blockSize} y={(gameHandler.activeBlock.position.y + block.position.y) * blockSize} width={blockSize} height={gameHandler.gameGrid.length * blockSize} fill="#F3F3F3"/>
    {/each}
    <MultiBlockComponent block={gameHandler.activeBlock} size={blockSize}/>
    {#each gameHandler.multiBlocks as multiBlock}
        <MultiBlockComponent block={multiBlock} size="{blockSize}" />
    {/each}
</svg>
        <div class="button" on:click={() => gameHandler.moveActiveBlockX(-1)}>
            left
        </div>
        <div class="button" on:click={() => gameHandler.moveActiveBlockX(1)}>
            right
        </div>
    </div>
</div>


<style>
    * {
        box-sizing: border-box;
    }

    :global(.containing) {
        display: flex;
        max-width: 340px;
		margin: 0 auto;
    }

    :global(.left) {
        flex: 5%;
    }
    :global(.left > *) {
        transform: rotate(-90deg);
        display:inline-block;
        margin-top:50px;
    }
    :global(.right) {
        flex: 95%;
    }

    :global(.button) {
        background-color: #7b38d8;
        border-radius: 10px;
        border: 4px double #cccccc;
        color: #eeeeee;
        text-align: center;
        padding: 15px;
        width: 100px;
        display:inline-block;
    }

    :global(.score) {
        margin: 0 auto;
        font-size:xx-large
    }

	svg {
		border: 1px solid #bbb;
		width: var(--game-width);
        height: var(--game-height);
		margin: 5px auto;
	}
</style>