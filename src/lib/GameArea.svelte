<script lang="ts">
    import Block from "./components/Block.svelte";
    import {TetrisBlock} from "./types/TetrisBlock"
    // import { GameGrid } from "./types/GameGrid";
    import { ZBlock } from "./types/blocks/ZBlock";
import { GameGrid } from "./types/GameGrid";

    let areaWidth: number = 10;
    let areaHeight: number = 20;
    let blockSize: number = 30;

    let gameGrid: GameGrid = {
        row:[]
    };

    // initialize gamegrid
    for (let i = 0; i < 20; i++) {
        gameGrid.row.push({column:[]});
        for (let j = 0; j < 10; j++) {
            gameGrid.row[i].column.push({occupied:false});
        }
    } 
    // gameGrid.row.push({column:[]});
    //     for (let j = 0; j < 10; j++) {
    //         gameGrid.row[20].column.push({occupied:true});
    //     }

    let blocks: TetrisBlock[] = [];

    let activeBlock: TetrisBlock = new ZBlock();
    activeBlock.position = {x: 3, y: 0};

    let key;
	let keyCode;
    
    function handleKeydown(event) {



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

        // activeBlock.position.y += progress/500;

        if (Math.abs(Math.round(activeBlock.position.y) - activeBlock.position.y) < 0.05) {
            activeBlock.blocks.forEach(unitBlock => {

            // console.log(activeBlock.position.y + unitBlock.position.y)
            if (activeBlock.position.y + unitBlock.position.y < 18.25) {
                if (gameGrid.row[Math.round(activeBlock.position.y + unitBlock.position.y + 1)].column[Math.round(activeBlock.position.x + unitBlock.position.x)].occupied) {
                    
                    if (activeBlock.position.y + unitBlock.position.y < 4) {
                        console.log("dead")
                    }
                console.log("touch")

                activeBlock.blocks.forEach(unitBlock => {
                    gameGrid.row[Math.round(activeBlock.position.y +unitBlock.position.y)].column[Math.round(activeBlock.position.x + unitBlock.position.x)] = unitBlock;
                });

                console.log(gameGrid)

                // blocks = [...blocks, activeBlock];
                activeBlock = new ZBlock();
                activeBlock.position = {x: 3, y: 0};
                                 
                }
            } else {
                activeBlock.blocks.forEach(unitBlock => {
                    gameGrid.row[Math.round(activeBlock.position.y +unitBlock.position.y)].column[Math.round(activeBlock.position.x + unitBlock.position.x)] = unitBlock;
                });

                console.log(gameGrid)

                // blocks = [...blocks, activeBlock];
                activeBlock = new ZBlock();
                activeBlock.position = {x: 3, y: 0};
            }
            // else if (activeBlock.position.y + unitBlock.position.y + 1 >= 20) {
            //     console.log("bottom")

            //     activeBlock.blocks.forEach(unitBlock => {
            //         gameGrid.row[Math.round(activeBlock.position.y + unitBlock.position.y)].column[Math.round(activeBlock.position.x + unitBlock.position.x)] = unitBlock;
            //     });

            //     console.log(gameGrid)

            //     blocks = [...blocks, activeBlock];
            //     activeBlock = new ZBlock();
            //     activeBlock.position = {x: 3, y: 0};
            // }
        });
        }

        
        // if ( activeBlock.reachFloor(areaHeight) ) {
        //     blocks = [...blocks, activeBlock];
        //     console.log(blocks);
        //     activeBlock = new IBlock();
        //     activeBlock.position = {x: 0, y: 0};
        // }
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
                {console.log(column)}
                <rect x="{j * blockSize}" y="{i * blockSize}" width="{blockSize}" height="{blockSize}" stroke="black" stroke-width="1" fill={column.color}/>
            {/if}
        {/each}
    {/each}
    <!-- {#each blocks as block}
        <Block block={block} size={blockSize}/>
    {/each} -->
</svg>


<style>
	svg {
		border: 1px solid #bbb;
		width: var(--game-width);
        height: var(--game-height);
		margin: 5px auto;
	}
</style>