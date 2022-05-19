import { ICoordinate } from "../GameComponents";
import { MultiBlock } from "../MultiBlock";

export class IBlock extends MultiBlock {

    constructor() {
        super();
        let blockOrientation: Array<Array<ICoordinate>> = [
            [
                {x:0, y:1},
                {x:1, y:1},
                {x:2, y:1},
                {x:3, y:1}      
            ],
            [
                {x:1, y:0},
                {x:1, y:1},
                {x:1, y:2},
                {x:1, y:3}
            ]
        ];
        let color = "#a4c639";

        this.init(blockOrientation, color)
    }

    
}