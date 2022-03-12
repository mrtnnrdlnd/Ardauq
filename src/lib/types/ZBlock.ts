import { Coordinate } from "./Coordinate";
import { TetrisBlock } from "./TetrisBlock";

export class ZBlock extends TetrisBlock {

    constructor() {
        super();
        this._corners = [
            {x:1, y:0},
            {x:2, y:0},
            {x:2, y:2},
            {x:1, y:2},
            {x:1, y:3},
            {x:0, y:3},
            {x:0, y:1},
            {x:1, y:1}
        ]

        this.rotationPoint = {x: 1.5, y: 1.5}

        this.color = "orange";
    }
}