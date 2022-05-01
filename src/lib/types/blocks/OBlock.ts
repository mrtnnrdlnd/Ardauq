import { ICoordinate } from "../GameComponents";
import { MultiBlock } from "../MultiBlock";

export class OBlock extends MultiBlock {

    constructor() {
        super();
        let blockOrientation: Array<Array<ICoordinate>> = [
            [
                {x:0, y:0},
                {x:0, y:1},
                {x:1, y:0},
                {x:1, y:1}      
            ]
        ];
        let color = "orange";

        this.init(blockOrientation, color)
    }

    
}