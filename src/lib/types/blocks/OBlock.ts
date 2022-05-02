import { ICoordinate } from "../GameComponents";
import { MultiBlock } from "../MultiBlock";

export class OBlock extends MultiBlock {

    constructor() {
        super();
        let blockOrientation: Array<Array<ICoordinate>> = [
            [
                {x:1, y:1},
                {x:1, y:2},
                {x:2, y:1},
                {x:2, y:2}      
            ]
        ];
        let color = "orange";

        this.init(blockOrientation, color)
    }

    
}