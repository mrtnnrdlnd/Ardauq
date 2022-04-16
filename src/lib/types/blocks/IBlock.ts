import { TetrisBlock } from "../TetrisBlock";

export class IBlock extends TetrisBlock {
    constructor() {
        super();
        this._possibleRotations = {
            0:[
                {position: {x:0, y:1}, connected: {right:true}},
                {position: {x:1, y:1}, connected: {right:true, left:true}},
                {position: {x:2, y:1}, connected: {right:true, left:true}},
                {position: {x:3, y:1}, connected: {left:true}}
            ],
            1:[
                {position: {x:1, y:0}, connected: {down:true}},
                {position: {x:1, y:1}, connected: {down:true, up:true}},
                {position: {x:1, y:2}, connected: {down:true, up:true}},
                {position: {x:1, y:3}, connected: {up:true}}
            ]
        }
        this._blocks = this._possibleRotations[0];
        this._color = "green";
    }
}