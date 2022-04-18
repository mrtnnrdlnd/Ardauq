
import { IBlock } from "./blocks/IBlock";
import { LBlock } from "./blocks/LBlock";
import { ZBlock } from "./blocks/ZBlock";
import { TetrisBlock } from "./TetrisBlock";

export class BlockFactory {

    static GenerateRandomBlock(): TetrisBlock {

        switch (Math.floor(Math.random() * 3)) {
            case 0: return new ZBlock();
            case 1: return new IBlock();
            case 2: return new LBlock();
        }

    }
}