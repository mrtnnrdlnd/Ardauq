<script lang="ts">
    import MultiBlockComponent from "./components/MultiBlockComponent.svelte";
    import UnitBlockComponent from "./components/UnitBlockComponent.svelte";

    import { GameHandler } from "./types/GameHandler";
import { MultiBlock } from "./types/MultiBlock";



    let areaWidth: number = 8;
    let areaHeight: number = 20;
    let blockSize: number = 30;

    export let paused: boolean = true;

    let gameHandler = new GameHandler(8, 20);
    gameHandler.newPiece();

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

        gameHandler = gameHandler;

    }

    function update(progress) {
        gameHandler.moveActiveBlockY(+1);
        if (gameHandler.hasReachedStop()) {
            gameHandler.dropBlock();
        }   
        gameHandler = gameHandler;
    }

    let timer = 0;
    function loop(timestamp) {
        var progress = timestamp - lastRender
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
    
    let colorArr = [];

    for (let index = 0; index < 50; index++) {
        colorArr.push("rgb(" + Math.floor(Math.random() * 255)+ ", " + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ")")
    }

</script>

<svelte:window on:keydown={handleKeydown}/>



<svg style="--game-width: {areaWidth*blockSize}px; --game-height: {areaHeight*blockSize}px">
    {#each gameHandler._multiBlocks as multiBlock, i}
        {#each multiBlock.blocks as block}
            <!-- {#if block.occupied} -->
                <UnitBlockComponent x={block.position.x * blockSize} y={block.position.y * blockSize} size="{blockSize}" block={{color:colorArr[i], connected:{up:block.connected.up,right:block.connected.right,down:block.connected.down,left:block.connected.left}}}/>
            <!-- {/if} -->
        {/each}
    {/each}
</svg>

<svg style="--game-width: {areaWidth*blockSize}px; --game-height: {areaHeight*blockSize}px">
    <MultiBlockComponent block={gameHandler.activeBlock} size={blockSize}/>
    {#each gameHandler.gameGrid.blocks as block, i}
            {#if block.occupied}
                <UnitBlockComponent x={block.position.x * blockSize} y={block.position.y * blockSize} size="{blockSize}" block={block}/>
            {/if}
    {/each}
</svg>

<svg style="--game-width: {areaWidth*blockSize}px; --game-height: {areaHeight*blockSize}px">
    {#each gameHandler.gameGrid.blocks as block, i}
            {#if block.occupied}
                <!-- {block = gameHandler.gameGrid.getBlock(block.position)} -->
                <UnitBlockComponent x={gameHandler.gameGrid.getBlock(block.position).position.x * blockSize} y={gameHandler.gameGrid.getBlock(block.position).position.y * blockSize} size="{blockSize}" block={{color:"gray", connected:{up:false,right:false,down:false,left:false}}}/>
            {/if}
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