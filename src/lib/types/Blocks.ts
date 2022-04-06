import { TetrisBlock } from "./TetrisBlock";

export class IBlock extends TetrisBlock {
    constructor() {
        super();
        this._possibleRotations = {
            0:[
                {x:0, y:1},
                {x:4, y:1},
                {x:4, y:2},
                {x:0, y:2}
            ],
            1:[
                {x:1, y:0},
                {x:2, y:0},
                {x:2, y:4},
                {x:1, y:4}
            ]
        }
        this._corners = this._possibleRotations[0];
        this._rotationPoint = {x: 1.5, y: 0.5}
        this._color = "green";
    }
}

// export class TBlock extends TetrisBlock {
//     constructor() {
//         super();
//         this._corners = [
//             {x:0, y:0},
//             {x:3, y:0},
//             {x:3, y:1},
//             {x:2, y:1},
//             {x:2, y:2},
//             {x:1, y:2},
//             {x:1, y:1},
//             {x:0, y:1}
//         ]
//         this._possibleRotations = [0, 90, 180, 270];
//         this._rotationPoint = {x: 1.5, y: 0.5}
//         this._color = "blue";
//     }
// }

export class ZBlock extends TetrisBlock {
    constructor() {
        super();
        this._possibleRotations = {
            0:[
                {x:0, y:1},
                {x:2, y:1},
                {x:2, y:2},
                {x:3, y:2},
                {x:3, y:3},
                {x:1, y:3},
                {x:1, y:2},
                {x:0, y:2}
            ],
            1:[
                {x:2, y:0},
                {x:3, y:0},
                {x:3, y:2},
                {x:2, y:2},
                {x:2, y:3},
                {x:1, y:3},
                {x:1, y:1},
                {x:2, y:1}
            ]
        }
        this._corners = this._possibleRotations[0];
        this._rotationPoint = {x: 1.5, y: 0.5}
        this._color = "red";
    }
}