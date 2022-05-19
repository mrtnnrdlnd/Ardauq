<!-- <svelte:options immutable/> -->
<script lang="ts">
import { Direction, IUnitBlock } from "../types/GameComponents";
    export let block: IUnitBlock;
    export let x: number;
    export let y: number;
    export let size: number;

    let subPieceClass: string;
    $: {
        subPieceClass = ""
        block.connected.forEach((direction) => {
           subPieceClass += " " + (Direction[direction]);
        })
    }
</script>

<div class="unitBlock {subPieceClass}" style="width:{size}px; height:{size}px; background-color:{block.color}; transform:translate({x}px, {y}px)" ></div>

<style>
    .unitBlock {
        position:absolute;
        box-sizing: border-box;
        border-width:0px;
        border-style:double;
        border-color:black;
    }
    :not(.up) {
        border-top-width: 1px;
    }
    :not(.down) {
        border-bottom-width: 1px;
    }
    :not(.left) {
        border-left-width: 1px;
    }
    :not(.right) {
        border-right-width: 1px;
    }
    :not(.down, .left) {
        border-bottom-left-radius: 3px;

    }
    :not(.down, .right) {
        border-bottom-right-radius: 3px;

    }
    :not(.up, .right) {
        border-top-right-radius: 3px;

    }
    :not(.up, .left) {
        border-top-left-radius: 3px;

    }
</style>