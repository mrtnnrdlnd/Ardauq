<script lang="ts">
    import Block from "./components/Block.svelte";
    import {TetrisBlock} from "./types/TetrisBlock"
    import { ZBlock, IBlock} from "./types/Blocks";
import { GameGrid } from "./types/GameGrid";

    let areaWidth: number = 10;
    let areaHeight: number = 20;
    let blockSize: number = 30;

    let blocks: TetrisBlock[] = [];

    let activeBlock: TetrisBlock = new ZBlock();
    activeBlock.position = {x: 4, y: 0};

    let key;
	let keyCode;
    
    function handleKeydown(event) {

    

        gameGrid.row[2].column[2] = {occupied: true, color: "red"};

        console.log(gameGrid);

		key = event.key;
		keyCode = event.keyCode;

        if(key === 'd') {
            activeBlock.rotateClockwise();
        }
        if(key === 's') {
            activeBlock.rotateTwice();
        }
        if(key === 'a') {
            activeBlock.rotateCounterClockwise();
        }


        if(key === 'ArrowLeft') {
            activeBlock.position.x -= 1;
        }
        if(key === 'ArrowRight' && activeBlock.position.x < areaWidth) {
            activeBlock.position.x += 1;
        }
    }


    function update(progress) {

        activeBlock.position.y += progress/500;

        if ( activeBlock.reachFloor(areaHeight) ) {
            blocks = [...blocks, activeBlock];
            console.log(blocks);
            activeBlock = new IBlock();
            activeBlock.position = {x: 0, y: 0};
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
    {#each blocks as block}
        <Block block={block} size={blockSize}/>
    {/each}
</svg>


<style>
	svg {
		border: 1px solid black;
		width: var(--game-width);
        height: var(--game-height);
		margin: 5px auto;
	}
</style>