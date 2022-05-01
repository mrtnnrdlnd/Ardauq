
import { IBlock } from "./blocks/IBlock";
import { LBlock } from "./blocks/LBlock";
import { OBlock } from "./blocks/OBlock";
import { SBlock } from "./blocks/SBlock";
import { ZBlock } from "./blocks/ZBlock";
import { TBlock } from "./blocks/TBlock";
import { JBlock } from "./blocks/JBlock";
import { MultiBlock } from "./MultiBlock";


export class BlockFactory {

    static GenerateRandomBlock(): MultiBlock {

        switch (Math.floor(Math.random() * 7)) {
            case 0: return new IBlock();
            case 1: return new LBlock();
            case 2: return new ZBlock();
            case 3: return new SBlock();
            case 4: return new OBlock();
            case 5: return new TBlock();
            case 6: return new JBlock();
        }

    }
}