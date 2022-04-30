
import { IBlock } from "./blocks/IBlock";
import { LBlock } from "./blocks/LBlock";
import { ZBlock } from "./blocks/ZBlock";
import { MultiBlock } from "./MultiBlock";

export class BlockFactory {

    static GenerateRandomBlock(): MultiBlock {

        switch (Math.floor(Math.random() * 3)) {
            case 0: return new IBlock();
            case 1: return new LBlock();
            case 2: return new ZBlock();
        }

    }
}