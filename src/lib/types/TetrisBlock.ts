import { Coordinate } from "./Coordinate";

export class TetrisBlock {
    private _position: Coordinate = {x:0, y:0};
    protected _corners: Coordinate[] = [];
    private _rotation: number = 0;
    protected _rotationPoint: Coordinate = {x:0, y:0}
    protected _color: string;

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

    public set corners(corners: Coordinate[]) {
        this._corners = corners;
    }

    public get rotation() {
        return this._rotation;
    }

    public set rotation(rotation: number) {
        this._rotation = rotation;
    }

    public get rotationPoint() {
        return this._rotationPoint;
    }

    public set rotationPoint(rotationPoint: Coordinate) {
        this._rotationPoint = rotationPoint;
    }
    
    public get color() {
        return this._color;
    }

    public set color(color:string) {
        this._color = color;
    }
}


