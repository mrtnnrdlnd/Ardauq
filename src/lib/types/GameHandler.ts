import { BlockFactory } from "./BlockFactory";
import { Direction, ICoordinate, IMultiBlock, ISlot, IUnitBlock } from "./GameComponents";
import { MultiBlock } from "./MultiBlock";


export class GameHandler {


    private _gameGrid: Array<Array<ISlot>>;
    private _activeBlock: MultiBlock;
    public _multiBlocks: MultiBlock[] = [];

    constructor(width: number, height: number) {
        this._gameGrid = Array.apply(null, Array(height)).map(() => {
            return Array.apply(null, Array(width)).map(() => {
                return {occupied: false}
            })
        });
    }

    public get gameGrid() {
        return this._gameGrid;
    }

    public get activeBlock() {
        return this._activeBlock;
    }

    public set activeBlock(activeBlock: MultiBlock) {
        this._activeBlock = activeBlock;
    }

    private rotateBlock(rotation: number) {
        switch(rotation) {
            case 90: 
                this._activeBlock.rotateClockwise() 
                break;
            case -90: 
                this._activeBlock.rotateCounterClockwise() 
                break;
            case 180: 
                this._activeBlock.rotateTwice() 
                break;
            case -180: 
                this._activeBlock.rotateTwice() 
                break;
        }
    }

    public rotateActiveBlock(rotation: number) {
        this.rotateBlock(rotation);
        if (this.onInvalidPosition(this._activeBlock)) {
            this.rotateBlock(-rotation);
        }
    }

    public moveActiveBlockX(steps: number) {
        this._activeBlock.position.x += steps;
            if (this.onInvalidPosition(this._activeBlock)) {
                this._activeBlock.position.x -= steps;
            }
    }

    public moveActiveBlockY(steps: number) {
        this._activeBlock.position.y += steps;
    }

    public moveBlockY(multiBlock: MultiBlock, steps: number) {
        multiBlock.position.y += steps;
    }

    public dropBlock() {
        this.fallDown();
        let rows = this.removeFullRows();
        while (rows.length > 0) {
            this.reconstructAllMultiBlocksAbove(this.gameGrid.length)
            this.applyGravity();
            rows = this.removeFullRows();
        }
        this.newPiece();
        
    }

    public fallDown(multiBlock?: MultiBlock) {
        if (multiBlock == undefined) {
            multiBlock = this._activeBlock;
        }

        while (!this.hasReachedStop(multiBlock)) {
            this.moveBlockY(multiBlock, 1);
        }
        this.saveToGrid(multiBlock);
    }


    private removeRow(rowNumber): void { 
        for (let column = 0; column < this._gameGrid[0].length; column++) {
            this._gameGrid[rowNumber][column] =  {occupied:false};

            let slotAbove = this._gameGrid[rowNumber - 1][column];
            if (slotAbove.occupied) {
                slotAbove.block.connected = slotAbove.block.connected.filter(d => d != Direction.down);
            }
            if (rowNumber < this._gameGrid.length - 1) {
                let slotBelow = this._gameGrid[rowNumber + 1][column];
                if (slotBelow.occupied) {
                    slotBelow.block.connected = slotBelow.block.connected.filter(d => d != Direction.up);
                }
            }
        }

    }
    
    public removeFullRows(): number[] {
        let rowIndices: number[] = [];
        for (let rowIndex = 0; rowIndex < this._gameGrid.length; rowIndex++) {
            if (!this._gameGrid[rowIndex].map(slot => slot.occupied).includes(false)) {
                this.removeRow(rowIndex);
                rowIndices.push(rowIndex)
            }
            
        }
        return rowIndices;
    }

    public onInvalidPosition(multiBlock?: MultiBlock): boolean {
        if (multiBlock == undefined) {
            multiBlock = this._activeBlock;
        }
        let multiBlockPosition = {x:multiBlock.position.x, y: multiBlock.position.y};
        let unitBlockPosition;
        for (let block of multiBlock.blocks) {
            unitBlockPosition = {x: multiBlockPosition.x + block.position.x, y: multiBlockPosition.y + block.position.y}
            if (unitBlockPosition.x < 0) {
                return true;
            }
            if (unitBlockPosition.x > this._gameGrid[0].length - 1) {
                return true;
            }
            if (this._gameGrid[unitBlockPosition.y][unitBlockPosition.x].occupied) {
                return true;
            }
        }
        return false;
    }

    public hasReachedStop(multiBlock?: MultiBlock): boolean {
        if (multiBlock == undefined) {
            multiBlock = this._activeBlock;
        }
        
        let multiBlockPosition = {x: multiBlock.position.x, y: multiBlock.position.y};
        let unitBlockPosition;
        for (let block of multiBlock.blocks) {
            unitBlockPosition = {x: multiBlockPosition.x + block.position.x, y: multiBlockPosition.y + block.position.y}
            if (unitBlockPosition.y > this._gameGrid.length - 1) {
                multiBlock.position.y--;
                return true;
            }
            if (this._gameGrid[unitBlockPosition.y][unitBlockPosition.x].occupied) {
                multiBlock.position.y--;
                return true;
            }
        }
        return false;
    }

    public saveToGrid(multiBlock?: MultiBlock) {
        if (multiBlock == undefined) {
            multiBlock = this._activeBlock;
        }
        let row: number;
        let column: number;
        multiBlock.blocks.forEach(unitBlock => {
            row = multiBlock.position.y + unitBlock.position.y;
            column = multiBlock.position.x + unitBlock.position.x;
            unitBlock.position = {x:column, y:row};
            this._gameGrid[row][column] = {
                occupied: true,
                block: unitBlock
            }
       })
    }

    public newPiece() {
        this._activeBlock = BlockFactory.GenerateRandomBlock();
        this._activeBlock.position = {x: 2, y: 0};
    }

    public applyGravity() {
        let stillFalling = true;
        while (stillFalling) {
            stillFalling = false;
            this._multiBlocks.forEach((multiBlock, i) => {
                multiBlock.blocks.forEach(block => {
                    this._gameGrid[block.position.y][block.position.x].occupied = false;
                })
                this.fallDown(multiBlock); 
                if (multiBlock.position.y > 0) {
                    multiBlock.position.y = 0;
                    stillFalling = true;   
                }        
            });
        }
    }

    public reconstructAllMultiBlocksAbove(row: number) {
        this._multiBlocks = [];

        let positions = this._gameGrid.flat(1)
            .filter(slot => slot.occupied)
            .map(slot => slot.block.position)
            .filter(position => position.y < row);


        let skip: ICoordinate[] = [];
        for (const position of positions) {
            if (skip.includes(position)) {
                continue;
            }
            let multiBlock = this.multiBlockAtPosition(position);
            this._multiBlocks.push(multiBlock);
            multiBlock.blocks.forEach(b => {
                skip.push(b.position)
            })
        }
    }

    public multiBlockAtPosition(position: ICoordinate): MultiBlock {
        let multiBlock = new MultiBlock();
        let unitBlock;

        unitBlock = this._gameGrid[position.y][position.x].block;
        
        multiBlock.blocks = this.addAdjecentBlocks(unitBlock);

        return multiBlock;
    }

    private addAdjecentBlocks(unitBlock: IUnitBlock): IUnitBlock[] {
        let nrOfAddedBlocks: number = 1;
        let addedBlocks: IUnitBlock[];
        let unitBlocks: IUnitBlock[] = [unitBlock];
        let adjecentSlot: ISlot;
        while (nrOfAddedBlocks > 0) {
            addedBlocks = unitBlocks.filter((_, i) => i >= unitBlocks.length - nrOfAddedBlocks);
            nrOfAddedBlocks = 0;
            addedBlocks.forEach(unitBlock => {
                Object.entries(unitBlock.connected).forEach(direction => {
                    adjecentSlot = this.getAdjecentSlot(unitBlock.position, direction[1]);
                    if (adjecentSlot.occupied && !unitBlocks.includes(adjecentSlot.block)) {
                        unitBlocks.push(adjecentSlot.block);
                        nrOfAddedBlocks++;
                    }
            
                });
            })
        }

        return unitBlocks;
    }

    private getAdjecentSlot(position:ICoordinate, direction: Direction) {
        let adjecentPosition: ICoordinate = {x: position.x, y: position.y};
        switch (direction) {
            case Direction.up: adjecentPosition.y--; break;
            case Direction.right: adjecentPosition.x++; break;
            case Direction.down: adjecentPosition.y++; break;
            case Direction.left: adjecentPosition.x--; break;
        }
        return this._gameGrid[adjecentPosition.y][adjecentPosition.x];
    }

}