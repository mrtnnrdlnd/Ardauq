<script lang="ts">
import GameArea from "./lib/GameArea.svelte";
import { ZBlock } from "./lib/types/blocks/ZBlock";
import { GameGrid } from "./lib/types/GameGrid";

	export let name: string = "Ardauq";

	// let gameGrid: GameGrid = {
    //         row:[]
    //     };

    //     for (let i = 0; i < 20; i++) {
    //         gameGrid.row.push({column:[]});
    //         for (let j = 0; j < 10; j++) {
    //             gameGrid.row[i].column.push({occupied:false});
    //         }
    //     }


	// 	var block = new ZBlock();
		
	// 	block.position.x = 3;
	// 	block.position.y = 3;


	// 	console.log(block.blocks)
	// 	block.blocks.forEach(subBlock => {
	// 		gameGrid.row[block.position.y + subBlock.position.y].column[block.position.x + subBlock.position.x] = subBlock;
	// 	});
    //     // gameGrid.row[block.position.y + block.blocks[0].position.y].column[block.position.x + block.blocks[0].position.x] = block.blocks[0];
	// 	// gameGrid.row[block.position.y + block.blocks[1].position.y].column[block.position.x + block.blocks[1].position.x] = block.blocks[1];
	// 	// gameGrid.row[block.position.y + block.blocks[2].position.y].column[block.position.x + block.blocks[2].position.x] = block.blocks[2];
	// 	// gameGrid.row[block.position.y + block.blocks[3].position.y].column[block.position.x + block.blocks[3].position.x] = block.blocks[3];

    //     console.log(gameGrid);

</script>

<main>
	<h1>{name}</h1>

	<!-- <table>
		{#each gameGrid.row as row}
			<tr>
				{#each row.column as column}
					<td style="background:{column.color}">{column.occupied}</td>
				{/each}
			</tr>
    	{/each}
	</table> -->

	<GameArea/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	td {
		width:40px;
		height:40px;
	}

	h1 {
		color: green;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>