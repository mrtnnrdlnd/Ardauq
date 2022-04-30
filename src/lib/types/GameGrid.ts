import { Coordinate, Direction, UnitBlock } from "./GameComponents";


export class GameGrid{

    private _blocks: UnitBlock[];
    private _width: number;
    private _height: number;

    constructor(width: number, height:number) {
        this._width = width;
        this._height = height;

        let nrOfBlocks = width*height;
        this._blocks = Array<UnitBlock>(nrOfBlocks);

        for (let index = 0; index < nrOfBlocks; index++) {
            this._blocks[index] = {occupied: false};
        }
    }

    public getAdjecentBlock(unitBlock: UnitBlock, direction: string) : UnitBlock {
        let adjecentPosition: Coordinate = {x: unitBlock.position.x, y: unitBlock.position.y};
        switch (direction) {
            case "up": adjecentPosition.y--; break;
            case "right": adjecentPosition.x++; break;
            case "down": adjecentPosition.y++; break;
            case "left": adjecentPosition.x--; break;
        }
        return this.getBlock(adjecentPosition);
    }

    public getRow(rowNumber: number): UnitBlock[] {
        let row: UnitBlock[] = Array<UnitBlock>(this.width);
        for (let column = 0; column < this.width; column++) {
            row[column] = this._blocks[rowNumber * this._width + column];
        }
        return row;
    }

    public getBlock(coordinate: Coordinate): UnitBlock {
        return this._blocks[coordinate.x + coordinate.y * this._width];
    }

    public setBlock(coordinate: Coordinate, block: UnitBlock) {
        if (coordinate.y >= this._height) {
            throw new Error("block below gamegrid");
            
        }
        block.position = coordinate;
        this._blocks[coordinate.x + coordinate.y * this._width] = block;
    }

    public set blocks(blocks : UnitBlock[]) {
        this._blocks = blocks;
    }

    public get blocks() {
        return this._blocks;
    }

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }
    

}