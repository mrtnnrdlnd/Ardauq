<script lang="ts">

	import GameArea from "./lib/GameArea.svelte";
	export let name: string = "Ardauq";
	let paused: boolean = true;

</script>

<main>
	<div id="title">{name}</div>
	<button on:click={() => paused = !paused}>
		{paused ? "Unpause" : "Pause"} 
	</button>
	<GameArea paused = {paused}/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	#title {
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