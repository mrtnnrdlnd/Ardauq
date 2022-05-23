import { BlockFactory } from "./BlockFactory";
import { Direction, ICoordinate, ISlot, IUnitBlock } from "./GameComponents";
import { MultiBlock } from "./MultiBlock";


export class GameHandler {


    private _gameGrid: Array<Array<ISlot>>;
    private _activeBlock: MultiBlock;
    private _multiBlocks: MultiBlock[] = [];
    private _gameOver: boolean = false;
    private _score: number = 0;
    private _paused: boolean = true;

    constructor(width: number, height: number) {
        this._gameGrid = Array.apply(null, Array(height)).map(() => {
            return Array.apply(null, Array(width)).map(() => {
                return {occupied: false}
            })
        });
    }

    
    public get paused() : boolean {
        return this._paused;
    }

    public set paused(paused : boolean) {
        this._paused = paused;
    }

    public get gameOver(): boolean {
        return this._gameOver;
    }
    
    

    public get score() {
        return this._score;
    }

    public get gameGrid() {
        return this._gameGrid;
    }

    public get activeBlock() {
        return this._activeBlock;
    }

    public get multiBlocks() {
        return this._multiBlocks;
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
        if (!this._paused) {
            this.rotateBlock(rotation);
            if (this.onInvalidPosition(this._activeBlock)) {
                this.rotateBlock(-rotation);
            }
        }
    }

    public moveActiveBlockX(steps: number) {
        if (!this._paused) {
            this._activeBlock.position.x += steps;
                if (this.onInvalidPosition(this._activeBlock)) {
                    this._activeBlock.position.x -= steps;
                }
        }
    }

    public moveActiveBlockY(steps: number) {
        if (!this._paused) {
            this._activeBlock.position.y += steps;
        }
    }

    private moveBlockY(multiBlock: MultiBlock, steps: number) {
            multiBlock.position.y += steps;
    }

    public async dropBlock() {
        this._paused = true;
        this.fallDown();
        await new Promise(r => setTimeout(r, 10));
        let rows = this.removeFullRows();
        let accRows = rows.length;
        while (rows.length > 0) {
            this._multiBlocks = [];
            this._multiBlocks = this.reconstructAllMultiBlocksAbove(this.gameGrid.length);  
            await new Promise(r => setTimeout(r, 150)); 
            this.applyGravity();            
            await new Promise(r => setTimeout(r, 300));
            rows = this.removeFullRows();     
            accRows += rows.length;    
        }
        if (accRows > 0) {
            // console.log (accRows);
            this._score += Math.pow(accRows, 2)
        }
        this._paused = false;
        this.newPiece();
        
    }

    private static copy(obj) {
		let copiedObject = {};
		Object.keys( obj ).forEach( function( key ) {
			if ( typeof obj[ key ] === 'object' ) {
				copiedObject[key] = GameHandler.copy( obj[ key ] );
			}
			else {
				copiedObject[key] = obj[key];
			}
		} );
		return copiedObject;
        // return JSON.parse(JSON.stringify(obj));
	}

    

    private fallDown(multiBlock?: MultiBlock) {
        if (multiBlock == undefined) {
            multiBlock = this._activeBlock;
        }

        while (!this.hasReachedStop(multiBlock)) {
            this.moveBlockY(multiBlock, 1);
        }
        let multiBlockToSave = new MultiBlock();
        multiBlockToSave.blocks = [];
        multiBlock.blocks.forEach(block => {
            block.position.x = block.position.x + multiBlock.position.x;
            block.position.y = block.position.y + multiBlock.position.y;
            multiBlockToSave.blocks.push(block);
        })
        this._multiBlocks.push(multiBlockToSave);
        this.saveToGrid(multiBlockToSave);
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

    private onInvalidPosition(multiBlock?: MultiBlock): boolean {
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

    private saveToGrid(multiBlock?: MultiBlock) {
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
        this._activeBlock.blocks.forEach(block => {
            if (this._gameGrid[this._activeBlock.position.y + block.position.y][this._activeBlock.position.x + block.position.x].occupied) {
                this._gameOver = true;
            }
        })
    }

    private applyGravity() {
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



    private reconstructAllMultiBlocksAbove(row: number): MultiBlock[] {
        let multiBlocks: MultiBlock[] = [];

        let positions = this._gameGrid.flat(1)
            .filter(slot => slot.occupied)
            .map(slot => slot.block.position)
            .filter(position => position.y < row);


        let skip: ICoordinate[] = [];
        let multiBlock
        for (const position of positions) {
            if (skip.includes(position)) {
                continue;
            }
            multiBlock = this.multiBlockAtPosition(position);
            multiBlocks.push(multiBlock);
            multiBlock.blocks.forEach(block => {
                skip.push(block.position)
            })
        }
        return multiBlocks;
    }

    private multiBlockAtPosition(position: ICoordinate): MultiBlock {
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