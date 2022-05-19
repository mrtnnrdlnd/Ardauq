import { ICoordinate } from "../GameComponents";
import { MultiBlock } from "../MultiBlock";


export class ZBlock extends MultiBlock {

    constructor() {
        super();
        let blockOrientation: Array<Array<ICoordinate>> = [
            [
                {x:0, y:1},
                {x:1, y:1},
                {x:1, y:2},
                {x:2, y:2}
            ],
            [
                {x:2, y:0},
                {x:2, y:1},
                {x:1, y:1},
                {x:1, y:2}
            ]
        ]
        let color = "#ff69b4";

        this.init(blockOrientation, color);
    }
    
}