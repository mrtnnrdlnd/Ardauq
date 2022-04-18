import { Coordinate } from "./Coordinate";
import { UnitBlock } from "./GameGrid";

export class FourBlock {
    protected _position: Coordinate = {x:0, y:0};
    protected _rotation: number = 0;
    protected _color: string;
    protected _blocks: UnitBlock[];

    protected _possibleRotations: any;
    protected _currentRotation: number = 0;

    constructor() {
    }

    public get position() {
        return this._position;
    }

    public set position(position: Coordinate) {
        this._position = position;
    }

    public get rotation() {
        return this._rotation;
    }

    public set rotation(rotation:number) {
        this._rotation = rotation;
    }

    public get blocks() {
        this._blocks.forEach(block => {
            block.color = this._color;
            block.occupied = true;
        });
        return this._blocks;
    }

    public set blocks(blocks:UnitBlock[]) {
        this._blocks = blocks;
    }

    public rotateClockwise() {
        if (this._currentRotation < Object.keys(this._possibleRotations).length - 1) {
            this._currentRotation++;
        } else {
            this._currentRotation = 0;
        }
        console.log(this._currentRotation)
        this._blocks = this._possibleRotations[this._currentRotation];
    }

    public rotateCounterClockwise() {
        if (this._currentRotation <= 0) {
            this._currentRotation = Object.keys(this._possibleRotations).length - 1;
        } else {
            this._currentRotation--;
        }
        this._blocks = this._possibleRotations[this._currentRotation];
    }

    public rotateTwice() {
        if (this._currentRotation < Object.keys(this._possibleRotations).length - 2) {
            this._currentRotation += 2;
            this._blocks = this._possibleRotations[this._currentRotation];
        } else if (this._currentRotation >= 2) {
            this._currentRotation -= 2;   
            this._blocks = this._possibleRotations[this._currentRotation]; 
        } 
    }
    
    public get color() {
        return this._color;
    }

    public set color(color:string) {
        this._color = color;
    }
    
}



