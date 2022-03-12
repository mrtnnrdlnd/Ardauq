<script lang="ts">
import GameArea from "./lib/GameArea.svelte";

	export let name: string = "Ardauq";
</script>

<main>
	<h1>{name}</h1>
	<GameArea/>
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