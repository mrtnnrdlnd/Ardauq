
// export interface GameGrid {
//     rows:BlockRow[];
// }

export interface BlockRow {
    columns:UnitBlock[];
}

// export interface MultiBlock {
//     position: Coordinate,
//     currentOrientation?: number,
//     blocks: {
//         0:UnitBlock[],
//         1?:UnitBlock[],
//         2?:UnitBlock[],
//         3?:UnitBlock[]
//     }
// }

export interface Slot {
    occupied:boolean;
}

export interface UnitBlock {
    index?:number;
    position?:Coordinate;
    occupied?:boolean;
    color?:string;
    connected?:{
        up?:boolean,
        right?:boolean,
        down?:boolean,
        left?:boolean
    };
}

export interface Coordinate {
    x: number;
    y: number;
}

export enum Direction {
    up,
    right,
    down,
    left
}