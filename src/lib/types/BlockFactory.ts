import { ZBlock } from "./Blocks";
import { TetrisBlock } from "./TetrisBlock";

export class BlockFactory {

    static GenerateRandom(): TetrisBlock {

        return new ZBlock();

    }
}