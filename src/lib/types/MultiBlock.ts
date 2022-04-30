import { Coordinate, UnitBlock } from "./GameComponents";

export class MultiBlock{

    protected _position: Coordinate = {x:0, y:0};
    protected _currentOrientation: number = 0;
    protected _blocks: Array<Array<UnitBlock>> = [];

    constructor() {
        this._blocks[0] = [];
    }

    public set position(position: Coordinate) {
        this._position = position;
    }

    public get position() {
        return this._position;
    }

    public get blocks(): UnitBlock[] {
        if (this._currentOrientation == undefined) {
            return this._blocks[0];
        }
        return this._blocks[this.orientation]
    }

    public set blocks(blocks:UnitBlock[]) {
        this._blocks[this.orientation] = blocks;
    }

    public get orientation() {
        if (this._currentOrientation == undefined) {
            return 0;
        }
        return this._currentOrientation
    }

    public set orientation(orientation: number) {
        this._currentOrientation = orientation;
    }

    public rotateClockwise() {
        if (this.orientation < Object.keys(this._blocks).length - 1) {
            this.orientation++;
        } else {
            this.orientation = 0;
        }
    }

    public rotateCounterClockwise() {
        if (this.orientation <= 0) {
            this.orientation = Object.keys(this._blocks).length - 1;
        } else {
            this.orientation--;
        }
    }

    public rotateTwice() {
        if (this.orientation < Object.keys(this._blocks).length - 2) {
            this.orientation += 2;
        } else if (this.orientation >= 2) {
            this.orientation -= 2;
        } 
    }
}