import { TetrisBlock } from "./TetrisBlock";

// export class IBlock extends TetrisBlock {
//     constructor() {
//         super();
//         this._possibleRotations = {
//             0:[
//                 {x:0, y:1},
//                 {x:1, y:1},
//                 {x:2, y:1},
//                 {x:3, y:1}
//             ],
//             1:[
//                 {x:1, y:0},
//                 {x:1, y:1},
//                 {x:1, y:2},
//                 {x:1, y:3}
//             ]
//         }
//         this._occupiedPositions = this._possibleRotations[0];
//         this._color = "green";
//     }
// }

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

// export class ZBlock extends TetrisBlock {
//     constructor() {
//         super();
//         this._possibleRotations = {
//             0:[
//                 {position: {x:0, y:1}, connected: {right:true}},
//                 {position: {x:1, y:1}, connected: {down:true, left:true}},
//                 {position: {x:1, y:2}, connected: {right:true, up:true}},
//                 {position: {x:2, y:2}, connected: {left:true}}
//             ],
//             1:[
//                 {position: {x:2, y:0}, connected: {down:true}},
//                 {position: {x:2, y:1}, connected: {left:true, up:true}},
//                 {position: {x:1, y:1}, connected: {down:true, right:true}},
//                 {position: {x:1, y:2}, connected: {up:true}}
//             ]
//         }
//         this._blocks = this._possibleRotations[0];
//         this._color = "red";
//     }
// }