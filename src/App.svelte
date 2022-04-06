<script lang="ts">
import GameArea from "./lib/GameArea.svelte";
import { GameGrid } from "./lib/types/GameGrid";

	export let name: string = "Ardauq";

	let gameGrid: GameGrid = {
            row:[]
        };

        for (let i = 0; i < 20; i++) {
            gameGrid.row.push({column:[]});
            for (let j = 0; j < 10; j++) {
                gameGrid.row[i].column.push({occupied:false});
            }
        }

        gameGrid.row[2].column[2] = {occupied: true, color: "red"};
		gameGrid.row[3].column[2] = {occupied: true, color: "red"};
		gameGrid.row[4].column[2] = {occupied: true, color: "red"};
		gameGrid.row[4].column[1] = {occupied: true, color: "red"};

        console.log(gameGrid);

</script>

<main>
	<h1>{name}</h1>

	<table>
		{#each gameGrid.row as row}
			<tr>
				{#each row.column as column}
					<td style="background:{column.color}">{column.occupied}</td>
				{/each}
			</tr>
    	{/each}
	</table>

	<!-- <GameArea/> -->
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
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