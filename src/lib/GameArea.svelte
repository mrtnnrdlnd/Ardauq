<script lang="ts">
    import Block from "./components/FourBlockComponent.svelte";
    import {FourBlock} from "./types/FourBlock"
    import { GameGrid, UnitBlock } from "./types/GameGrid";
    import { BlockFactory } from "./types/BlockFactory";
import UnitBlockComponent from "./components/UnitBlockComponent.svelte";

    let areaWidth: number = 8;
    let areaHeight: number = 20;
    let blockSize: number = 30;

    export let paused: boolean = true;

    let gameGrid: GameGrid = {
        row:[]
    };

    // initialize gamegrid
    for (let i = 0; i < areaHeight; i++) {
        gameGrid.row.push({column:[]});
        for (let j = 0; j < areaWidth; j++) {
            gameGrid.row[i].column.push({occupied:false});
        }
    }

    let activeBlock: FourBlock = BlockFactory.GenerateRandomBlock();
    activeBlock.position = {x: 2, y: 0};

    let key;
	let keyCode;

    let blockCopy: FourBlock = new FourBlock();
    
    function handleKeydown(event) {

        key = event.key;
        keyCode = event.keyCode;

        if(key === 'd') {
            activeBlock.rotateClockwise();
            if (invalidPosition(activeBlock, gameGrid)) {
                activeBlock.rotateCounterClockwise();
            }
        }
        if(key === 's') {
            activeBlock.rotateTwice();
            if (invalidPosition(activeBlock, gameGrid)) {
                activeBlock.rotateTwice();
            }
        }
        if(key === 'a') {
            activeBlock.rotateCounterClockwise();
            if (invalidPosition(activeBlock, gameGrid)) {
                activeBlock.rotateClockwise();
            }
        }

        if(key === 'ArrowLeft') {
            activeBlock.position.x -= 1;
            if (invalidPosition(activeBlock, gameGrid)) {
                activeBlock.position.x += 1;
            }
        }

        if(key === 'ArrowRight') {
            activeBlock.position.x += 1;
            if (invalidPosition(activeBlock, gameGrid)) {
                activeBlock.position.x -= 1;
            }
        }

    }   

    function invalidPosition(fourBlock: FourBlock, gameGrid: GameGrid): boolean {
        let fourBlockPosition = {x: Math.round(fourBlock.position.x), y: Math.round(fourBlock.position.y)};
        let unitBlockPosition;
        for (let block of fourBlock.blocks) {
            unitBlockPosition = {x: fourBlockPosition.x + block.position.x, y: fourBlockPosition.y + block.position.y}
            if (unitBlockPosition.x < 0) {
                return true;
            }
            if (unitBlockPosition.x > gameGrid.row[0].column.length - 1) {
                return true;
            }
            if (gameGrid.row[unitBlockPosition.y].column[unitBlockPosition.x].occupied) {
                return true;
            }
        }
        return false;
    }

    function reachedStop(fourBlock: FourBlock, gameGrid: GameGrid): boolean {
        let fourBlockPosition = {x: Math.round(fourBlock.position.x), y: Math.round(fourBlock.position.y)};
        let unitBlockPosition;
        for (let block of fourBlock.blocks) {
            unitBlockPosition = {x: fourBlockPosition.x + block.position.x, y: fourBlockPosition.y + block.position.y}
            if (unitBlockPosition.y > gameGrid.row.length - 2) {
                return true;
            }
            if (gameGrid.row[unitBlockPosition.y + 1].column[unitBlockPosition.x].occupied) {
                return true;
            }
        }
        return false;
    }


    function update(progress) {

        if (!paused) {
            activeBlock.position.y += progress/500;
        }

        if (Math.round(activeBlock.position.y) - activeBlock.position.y < 0.05) {
            if (reachedStop(activeBlock, gameGrid)) {

                activeBlock.blocks.forEach(unitBlock => {
                    gameGrid.row[Math.round(activeBlock.position.y + unitBlock.position.y)].column[Math.round(activeBlock.position.x + unitBlock.position.x)] = unitBlock;
                });

                activeBlock = BlockFactory.GenerateRandomBlock();
                activeBlock.position = {x: 2, y: 0};
            }
        }
    }

    function loop(timestamp) {
        var progress = timestamp - lastRender
        
        update(progress)
        // draw()

        lastRender = timestamp
        window.requestAnimationFrame(loop)
    }
    var lastRender = 0
    window.requestAnimationFrame(loop)
    

</script>

<svelte:window on:keydown={handleKeydown}/>

<svg style="--game-width: {areaWidth*blockSize}px; --game-height: {areaHeight*blockSize}px">
    <Block block={activeBlock} size={blockSize}/>
    {#each gameGrid.row as row, i}
        {#each row.column as column, j}
            {#if column.occupied}
                <UnitBlockComponent x={j * blockSize} y={i * blockSize} size="{blockSize}" block={column}/>
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