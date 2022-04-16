import { Coordinate } from "./Coordinate";

export interface GameGrid {
    row:BlockRow[];
}

export interface BlockRow {
    column:UnitBlock[];
}

export interface UnitBlock {
    position?:Coordinate;
    occupied?:boolean;
    color?:string;
    connected?:{
        up:boolean,
        right:boolean,
        down:boolean,
        left:boolean
    };
}