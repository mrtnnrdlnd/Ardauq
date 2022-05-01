import { Direction, ICoordinate, IUnitBlock } from "./GameComponents";

export class UnitBlock implements IUnitBlock {
    position: ICoordinate;
    color: string;
    connected: Direction[];
    
    constructor(position: ICoordinate, color?: string, connected?: Direction[]) {
        this.position = position;
        if (color != undefined) {
            this.color = color;
        }
        if (connected != undefined) {
            this.connected = connected;
        }
    }
}