import { ICoordinate } from "../GameComponents";
import { MultiBlock } from "../MultiBlock";

export class JBlock extends MultiBlock {

    constructor() {
        super();
        let blockOrientation: Array<Array<ICoordinate>> = [
            [
                {x:0, y:1},    
                {x:1, y:1},
                {x:2, y:1},
                {x:2, y:2},     
            ],
            [
                {x:1, y:0},       
                {x:1, y:1},
                {x:1, y:2},               
                {x:0, y:2}
            ],
            [
                {x:2, y:1},      
                {x:1, y:1},               
                {x:0, y:1},
                {x:0, y:0}   
            ],
            [
                {x:1, y:2},     
                {x:1, y:1},               
                {x:1, y:0},                
                {x:2, y:0} 
            ]
        ]

        let color = "#cd9575";

        this.init(blockOrientation, color);
    }
}