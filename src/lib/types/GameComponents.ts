
export interface IGameGrid {
    slots: Array<Array<ISlot>>;
}

export interface ISlot {
    occupied:boolean;
    block?:IUnitBlock;
}

export interface IMultiBlock {
    position: ICoordinate,
    blocks: IUnitBlock[]
}

export interface IUnitBlock {
    position:ICoordinate;
    color:string;
    connected:Direction[];
}

export interface ICoordinate {
    x: number;
    y: number;
}

export enum Direction {
    up,
    right,
    down,
    left
}