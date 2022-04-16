import { TetrisBlock } from "../TetrisBlock";

export class ZBlock extends TetrisBlock {
    constructor() {
        super();
        this._possibleRotations = {
            0:[
                {position: {x:0, y:1}, connected: {right:true}},
                {position: {x:1, y:1}, connected: {down:true, left:true}},
                {position: {x:1, y:2}, connected: {right:true, up:true}},
                {position: {x:2, y:2}, connected: {left:true}}
            ],
            1:[
                {position: {x:2, y:0}, connected: {down:true}},
                {position: {x:2, y:1}, connected: {left:true, up:true}},
                {position: {x:1, y:1}, connected: {down:true, right:true}},
                {position: {x:1, y:2}, connected: {up:true}}
            ]
        }
        this._blocks = this._possibleRotations[0];
        this._color = "#f55";
    }
}