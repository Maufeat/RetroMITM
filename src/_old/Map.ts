import xml2js from 'xml2js'
import fs from 'fs'
import Cell from './Cell';
import CellType from './Cell'
import { randomBytes } from 'crypto';
import Utils from './Utils';

export default class MapX{
    
    id: number = 0;

    width: number = 14;
    height: number = 18;

    x: number = 0;
    y: number = 0;

    map_data: string = "";

    cells: Cell[] = [];

    refreshMap(packet: string){
        let _loc3: string[] = packet.split("|");

        this.id = Number.parseInt(_loc3[0]);

        let parser = new xml2js.Parser();
        fs.readFile(__dirname + '\\..\\data\\maps\\' + this.id + '.xml', (err, data) => {
            parser.parseString(data, (err: any, result: any) => {

                this.id = result.RECORD.ID
                this.width = result.RECORD.ANCHURA
                this.height = result.RECORD.ALTURA
                this.x = result.RECORD.X
                this.y = result.RECORD.Y

                this.decompressMap(result.RECORD.MAPA_DATA.toString())
                
            });
        })

        console.log(`Current Map: ${this.id} X:${this.x} Y:${this.y}`)
    }

    getCellFromId(id: number): Cell{
        return this.cells[id];
    }

    decompressMap(map_data: string){
        let cells_value = "";
        
        for(let i = 0; i < map_data.length; i += 10){
            cells_value = String(map_data).substr(i, 10);
            this.cells[i / 10] = this.decompressCell(cells_value, i/10);
        }
    }

    decompressCell(cellData: string, cellId: number): Cell{
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

        return new Cell(cellId, type, active, this);
    }

}