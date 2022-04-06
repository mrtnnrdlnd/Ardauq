export interface GameGrid {
    row:BlockRow[];
}

export interface BlockRow {
    column:UnitBlock[];
}

export interface UnitBlock {
    occupied:boolean;
    color?:string;
    connectedTo?:{row:number, column:number}[];
}