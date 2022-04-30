
import { Coordinate, UnitBlock } from "../GameComponents";
import { MultiBlock } from "../MultiBlock";

export class IBlock extends MultiBlock {

    constructor() {
        super();
        this._blocks = [
            [
                {position: {x:0, y:1}, connected: {right:true}},
                {position: {x:1, y:1}, connected: {right:true, left:true}},
                {position: {x:2, y:1}, connected: {right:true, left:true}},
                {position: {x:3, y:1}, connected: {left:true}}
            ],
            [
                {position: {x:1, y:0}, connected: {down:true}},
                {position: {x:1, y:1}, connected: {down:true, up:true}},
                {position: {x:1, y:2}, connected: {down:true, up:true}},
                {position: {x:1, y:3}, connected: {up:true}}
            ]
        ]
        Object.entries(this._blocks).forEach(([key, rotation]) => {
            rotation.forEach(block => {
                block.color = "green";
                block.occupied = true;
            })
        });

        this._currentOrientation = 0;
    }
}