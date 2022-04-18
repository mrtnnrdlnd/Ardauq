import { FourBlock } from "../FourBlock";

export class LBlock extends FourBlock {
    constructor() {
        super();
        this._possibleRotations = {
            0:[
                {position: {x:0, y:2}, connected: {up:true}},
                {position: {x:0, y:1}, connected: {right:true, down:true}},
                {position: {x:1, y:1}, connected: {right:true, left:true}},
                {position: {x:2, y:1}, connected: {left:true}}
                
            ],
            1:[
                {position: {x:0, y:0}, connected: {right:true}},
                {position: {x:1, y:0}, connected: {down:true, left:true}},
                {position: {x:1, y:1}, connected: {down:true, up:true}},
                {position: {x:1, y:2}, connected: {up:true}}
                
            ],
            2 :[
                {position: {x:2, y:1}, connected: {down:true}},
                {position: {x:2, y:2}, connected: {left:true, up:true}},
                {position: {x:1, y:2}, connected: {left:true, right:true}},
                {position: {x:0, y:2}, connected: {right:true}}
                
            ],
            3:[
                {position: {x:0, y:0}, connected: {down:true}},
                {position: {x:0, y:1}, connected: {down:true, up:true}},
                {position: {x:0, y:2}, connected: {right:true, up:true}},
                {position: {x:1, y:2}, connected: {left:true}}
            ]
        }
        this._blocks = this._possibleRotations[0];
        this._color = "purple";
    }
}