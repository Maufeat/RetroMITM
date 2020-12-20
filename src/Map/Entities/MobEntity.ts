import Utils from "../../Utils/Utils";
import { IEntity } from "./IEntity";

export default class MobEntity implements IEntity{
    id = 0
    cellId = 0
    orientation = 0
    unk1 = 0

    constructor(cellId: number){
        this.cellId = cellId
    }

    setEntity(entityInfos: string[]): MobEntity{
        this.cellId = Number.parseInt(entityInfos[0])
        return this
    }

    parseEntity(): string{
        let entityString: string[] = []
        this.cellId = Number.parseInt(entityString[0])
        return ""
    }
}