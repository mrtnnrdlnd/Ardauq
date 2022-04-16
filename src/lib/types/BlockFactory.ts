
import { ZBlock } from "./blocks/ZBlock";
import { TetrisBlock } from "./TetrisBlock";

export class BlockFactory {

    static GenerateRandom(): TetrisBlock {

        return new ZBlock();

    }
}