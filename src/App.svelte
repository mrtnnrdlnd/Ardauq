<script lang="ts">

	import GameArea from "./lib/GameArea.svelte";

</script>

<main>
	
	
	<GameArea/>

</main>

<style>
	main {
		text-align: center;
	}

	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>