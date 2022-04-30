import { SvelteComponent } from "../../../node_modules/svelte/types/runtime/index";
import { BlockFactory } from "./BlockFactory";
import { Coordinate, UnitBlock } from "./GameComponents";
import { GameGrid } from "./GameGrid";
import { MultiBlock } from "./MultiBlock";

export class GameHandler {


    private _gameGrid: GameGrid;
    private _activeBlock: MultiBlock;
    public _multiBlocks: MultiBlock[] = [];

    constructor(width: number, height: number) {

        this._gameGrid = new GameGrid(width, height);
    }

    public get gameGrid(): GameGrid {
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

    public dropBlock() {
        this.fallDown();
        let rows = this.removeFullRows();
        if (rows.length > 0) {
            this.reconstructAllMultiBlocksAbove(Math.max(...rows))
            this.applyGravity();
        }
        this.newPiece();
        
    }

    public fallDown() {
        while (!this.hasReachedStop()) {
            this.moveActiveBlockY(1);
        }
        console.log(this._activeBlock)
        this.saveToGrid();
    }


    private removeRow(rowNumber): void { 
        for (let column = 0; column < this._gameGrid.width; column++) {
            this._gameGrid.setBlock({x: column, y: rowNumber}, {occupied:false});

            if (this._gameGrid.getBlock({x: column, y: rowNumber - 1}).occupied) {
                Object.assign(this._gameGrid.getBlock({x: column, y: rowNumber - 1}).connected, {down:false})
            }
            if (rowNumber < this._gameGrid.height - 1 && this._gameGrid.getBlock({x: column, y: rowNumber + 1}).occupied) {
                Object.assign(this._gameGrid.getBlock({x: column, y: rowNumber + 1}).connected, {up:false});
            }
        }

    }
    
    public removeFullRows(): number[] {
        let rowIndices: number[] = [];
        for (let rowIndex = 0; rowIndex < this._gameGrid.height; rowIndex++) {
            if (!this._gameGrid.getRow(rowIndex).map(c => c.occupied).includes(false)) {
                this.removeRow(rowIndex);
                rowIndices.push(rowIndex)
            }
            
        }
        return rowIndices;
    }

    // public registerMultiBlock(multiBlock: MultiBlock) {
    //     this._multiBlocks.push(multiBlock);
    //     multiBlock.blocks.forEach(unitBlock => {
    //         this._gameGrid.setBlock({x: multiBlock.position.x + unitBlock.position.x, y: multiBlock.position.y + unitBlock.position.y}, unitBlock);
    //     });
    //     this._gameGrid = this._gameGrid;
    // }

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
            if (unitBlockPosition.x > this._gameGrid.width - 1) {
                return true;
            }
            if (this._gameGrid.getBlock({x: unitBlockPosition.x, y: unitBlockPosition.y}).occupied) {
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
            if (unitBlockPosition.y > this._gameGrid.height - 1) {
                multiBlock.position.y--;
                console.log(unitBlockPosition)
                console.log(multiBlock)
                return true;
            }
            if (this._gameGrid.getBlock({x: unitBlockPosition.x, y: unitBlockPosition.y}).occupied) {
                multiBlock.position.y--;
                console.log(unitBlockPosition)
                console.log(multiBlock)
                return true;
            }
        }
        return false;
    }

    public saveToGrid(multiBlock?: MultiBlock) {
        if (multiBlock == undefined) {
            multiBlock = this._activeBlock;
        }
        multiBlock.blocks.forEach(unitBlock => {
            unitBlock.occupied = true;

            // console.log("multiblock.y:" + multiBlock.position.y)
            // console.log("unitblock.y:" + unitBlock.position.y)
            // console.log(this._gameGrid.blocks.length);
            this._gameGrid.setBlock({x: multiBlock.position.x + unitBlock.position.x, y: multiBlock.position.y + unitBlock.position.y}, unitBlock);
        })
    }

    public newPiece() {
        this._activeBlock = BlockFactory.GenerateRandomBlock();
        this._activeBlock.position = {x: 2, y: 0};
    }

    public applyGravity() {
        
        for (let index = 0; index < 4; index++) {
            this._multiBlocks.forEach((multiBlock, i) => {



                this._activeBlock = multiBlock;
                this._activeBlock.blocks.forEach(block => {
                    block.occupied = false;
                });


                this.fallDown(); 
                

                
            });
            console.log(this._multiBlocks)
        }

        console.log(this._gameGrid.blocks);

        // new Promise(resolve => setTimeout(resolve, 1000));
        // }
            
    }

    public reconstructAllMultiBlocksAbove(row: number) {
        this._multiBlocks = [];

        let positions = this._gameGrid.blocks
            .filter(block => block.occupied)
            .map(block => block.position)
            .filter(position => position.y < row);


        let skip: Coordinate[] = [];
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
        console.log(this._multiBlocks)
    }

    public multiBlockAtPosition(position: Coordinate): MultiBlock {
        let multiBlock = new MultiBlock();
        let unitBlock;

        unitBlock = this._gameGrid.getBlock(position);
        
        multiBlock.blocks = this.addAdjecentBlocks(unitBlock);

        return multiBlock;
    }

    private addAdjecentBlocks(unitBlock: UnitBlock): UnitBlock[] {
        let nrOfAddedBlocks: number = 1;
        let addedBlocks: UnitBlock[];
        let unitBlocks: UnitBlock[] = [unitBlock];
        let addingUnitBlock: UnitBlock;
        while (nrOfAddedBlocks > 0) {
            addedBlocks = unitBlocks.filter((_, i) => i >= unitBlocks.length - nrOfAddedBlocks);
            nrOfAddedBlocks = 0;
            addedBlocks.forEach(unitBlock => {
                Object.entries(unitBlock.connected).forEach(direction => {
                    if (direction[1]) {
                        addingUnitBlock = this._gameGrid.getAdjecentBlock(unitBlock, direction[0]);
                        if (addingUnitBlock.occupied && !unitBlocks.includes(addingUnitBlock)) {
                            unitBlocks.push(addingUnitBlock);
                            nrOfAddedBlocks++;
                        }
                    }
                });
            })
        }

        return unitBlocks;
    }

}