import { Coordinate } from "./Coordinate";

export class TetrisBlock {
    private _position: Coordinate = {x:0, y:0};
    protected _corners: Coordinate[] = [];
    protected _rotation: number = 0;
    protected _rotationPoint: Coordinate = {x:0, y:0}
    protected _color: string;

    protected _possibleRotations: any;
    protected _currentRotation: number = 0;
    protected _width: number[] = [0, 0];

    constructor() {
    }

    public get position() {
        return this._position;
    }

    public set position(position: Coordinate) {
        this._position = position;
    }

    public get corners() {
        return this._corners;
    }

    public get rotation() {
        return this._rotation;
    }

    public rotateClockwise() {
        if (this._currentRotation < Object.keys(this._possibleRotations).length - 1) {
            this._currentRotation++;
        } else {
            this._currentRotation = 0;
        }
        console.log(this._currentRotation)
        this._corners = this._possibleRotations[this._currentRotation];
    }


    // roterar coordinater
    public rotateCounterClockwise() {
        if (this._currentRotation <= 0) {
            this._currentRotation = Object.keys(this._possibleRotations).length - 1;
        } else {
            this._currentRotation--;
        }
        this._corners = this._possibleRotations[this._currentRotation];
    }

    public rotateTwice() {
        if (this._currentRotation < Object.keys(this._possibleRotations).length - 2) {
            this._currentRotation += 2;
            this._corners = this._possibleRotations[this._currentRotation];
        } else if (this._currentRotation >= 2) {
            this._currentRotation -= 2;   
            this._corners = this._possibleRotations[this._currentRotation]; 
        }
        
    }

    public get rotationPoint() {
        return this._rotationPoint;
    }
    
    public get color() {
        return this._color;
    }

    public set color(color:string) {
        this._color = color;
    }

    public blockedByOther(blocks: TetrisBlock[]): boolean {

        return false;
    }

    public reachOther(blocks: TetrisBlock[]): boolean {

        return false;
    }

    public reachFloor(floor: number): boolean {
        return floor < (this._position.y + Math.max(...this._corners.map(c => c.y)));
    }

    
}



