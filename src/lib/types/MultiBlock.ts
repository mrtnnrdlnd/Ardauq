import { Direction, ICoordinate, IMultiBlock, IUnitBlock } from "./GameComponents";
import { UnitBlock } from "./UnitBlock";

export class MultiBlock implements IMultiBlock{

    position: ICoordinate = {x:0, y:0};
    protected _orientation: number = 0;
    protected _blocks: Array<Array<IUnitBlock>> = [];

    public get blocks(): IUnitBlock[] {
        if (this._orientation == undefined) {
            return this._blocks[0];
        }
        return this._blocks[this._orientation]
    }

    public set blocks(blocks:IUnitBlock[]) {
        this._blocks[this._orientation] = blocks;
    }

    public rotateClockwise() {
        if (this._orientation < Object.keys(this._blocks).length - 1) {
            this._orientation++;
        } else {
            this._orientation = 0;
        }
    }

    public rotateCounterClockwise() {
        if (this._orientation <= 0) {
            this._orientation = Object.keys(this._blocks).length - 1;
        } else {
            this._orientation--;
        }
    }

    public rotateTwice() {
        if (this._orientation < Object.keys(this._blocks).length - 2) {
            this._orientation += 2;
        } else if (this._orientation >= 2) {
            this._orientation -= 2;
        } 
    }

    protected init(blockOrientations: ICoordinate[][], color: string) {
        let connectedTo: Direction[];
        blockOrientations.forEach((orientation, index) => {
            this._blocks.push([]);
            orientation.forEach(position => {
                connectedTo = [];
                if (orientation.filter(p => p.x == position.x && p.y == position.y - 1).length > 0) {
                    connectedTo.push(Direction.up);
                }
                if (orientation.filter(p => p.x == position.x + 1 && p.y == position.y).length > 0) {
                    connectedTo.push(Direction.right);
                }
                if (orientation.filter(p => p.x == position.x && p.y == position.y + 1).length > 0) {
                    connectedTo.push(Direction.down);
                }
                if (orientation.filter(p => p.x == position.x - 1 && p.y == position.y).length > 0) {
                    connectedTo.push(Direction.left);
                }
                this._blocks[index].push(new UnitBlock(position, color, connectedTo));

            })
        });
    }
}