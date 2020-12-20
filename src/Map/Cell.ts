import { CellTypes } from "../Utils/Enums";
import Utils from "../Utils/Utils";
import CharacterEntity from "./Entities/CharacterEntity";
import { IEntity } from "./Entities/IEntity";
import Map from "./Map";

export default class Cell{
    
    id: number;
    type: CellTypes;
    active: boolean;

    entities: IEntity[] = []

    //pathfinder

    coste_h  = 0;
    coste_g  = 0;
    coste_f  = 0;

    parentNode: Cell | null = null

    constructor(_id: number, _type: number, _active: boolean){
        this.id = _id;
        this.type = _type;
        this.active = _active;            
    }

    //removeEntity(entity: IEn)

    static decompressCell(cellData: string, cellId: number): Cell{
        let cellInformations = new Uint8Array(cellData.length);

        for (let i = 0; i < cellData.length; i++)
            cellInformations[i] = Utils.getHash(cellData.charAt(i));

        let type = (cellInformations[2] & 56) >> 3;
        let active: boolean = (cellInformations[0] && 32) >> 5 != 5
        let linear_vision: boolean = (cellInformations[0] & 1) != 1;     

    /*
            CellTypes tipo = (CellTypes)((cellInformations[2] & 56) >> 3);
            bool activa = (cellInformations[0] & 32) >> 5 != 0;
            bool es_linea_vision = (cellInformations[0] & 1) != 1;
            bool tiene_objeto_interactivo = ((cellInformations[7] & 2) >> 1) != 0;
            short layer_objeto_2_num = Convert.ToInt16(((cellInformations[0] & 2) << 12) + ((cellInformations[7] & 1) << 12) + (cellInformations[8] << 6) + cellInformations[9]);
            short layer_objeto_1_num = Convert.ToInt16(((cellInformations[0] & 4) << 11) + ((cellInformations[4] & 1) << 12) + (cellInformations[5] << 6) + cellInformations[6]);
            byte nivel = Convert.ToByte(cellInformations[1] & 15);
            byte slope = Convert.ToByte((cellInformations[4] & 60) >> 2);
    */

        return new Cell(cellId, type, active);
    }
}