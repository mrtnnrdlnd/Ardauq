
import { Coordinate, UnitBlock } from "../GameComponents";
import { MultiBlock } from "../MultiBlock";

export class ZBlock extends MultiBlock {

    constructor() {
        super();
        this._blocks = [
            [
                {position: {x:0, y:1}, connected: {right:true}},
                {position: {x:1, y:1}, connected: {down:true, left:true}},
                {position: {x:1, y:2}, connected: {right:true, up:true}},
                {position: {x:2, y:2}, connected: {left:true}}
            ],
            [
                {position: {x:2, y:0}, connected: {down:true}},
                {position: {x:2, y:1}, connected: {left:true, up:true}},
                {position: {x:1, y:1}, connected: {down:true, right:true}},
                {position: {x:1, y:2}, connected: {up:true}}
            ]
        ]
        Object.entries(this._blocks).forEach(([key, rotation]) => {
            rotation.forEach(block => {
                block.color = "red";
                block.occupied = true;
            })
        });

        this._currentOrientation = 0;
    }
}