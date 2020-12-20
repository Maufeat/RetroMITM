import xml2js from 'xml2js'
import fs from 'fs'
import Cell from './Cell'
import { IEntity } from './Entities/IEntity'
import MobEntity from './Entities/MobEntity'

export default class Map{

    id: number = 0
    date: string = ""
    decryptionKey: string = ""

    width: number = 0
    height: number = 0

    data: string = ""

    cells: Cell[] = []

    parseMap(packet: string){
        let data = packet.split("|")
        this.id = Number.parseInt(data[1])
        this.date = data[2]
        this.decryptionKey = data[3]

        let parser = new xml2js.Parser();
        fs.readFile(__dirname + '\\..\\..\\data\\maps\\' + this.id + '.xml', (err, data) => {
            parser.parseString(data, (err: any, result: any) => {

                this.id = result.RECORD.ID
                this.width = result.RECORD.ANCHURA
                this.height = result.RECORD.ALTURA

                let map_data = result.RECORD.MAPA_DATA.toString()

                let cells_value = "";
                this.cells = []
                for(let i = 0; i < map_data.length; i += 10){
                    cells_value = String(map_data).substr(i, 10);
                    this.cells[i / 10] = Cell.decompressCell(cells_value, i/10);
                }

                console.log(`This map has ${this.cells.length} Cells`)
            });
        })
    }

    getMonster(): MobEntity | null{
        let mob = null;
        this.cells.forEach((cell) => {
            cell.entities.forEach((entity) => {
                if(entity instanceof MobEntity){
                    mob = entity
                }
            })
        })
        return mob;
    }

    getEntityCound(): number {
        let i = 0
        this.cells.forEach((cell) => {
            cell.entities.forEach((entity) => {
                i++
            })
        })
        return i;
    }

    addEntity(entity: IEntity){
        this.cells[entity.cellId].entities.push(entity)
    }

    removeEntity(entityId: number){
        this.cells.forEach((cell) =>{
            cell.entities.forEach((entity, index) => {
                if (entity.id == entityId)
                    cell.entities.splice(index, 1)
            })
        })
    }

    getEntity(entityId: number): IEntity | null{
        let entity = null
        this.cells.forEach((cell) =>{
            cell.entities.forEach((_entity, index) => {
                if (_entity.id == entityId)
                    entity = _entity
            })
        })
        return entity
    }

    updateEntity(entity: IEntity, cell: Cell){
        this.removeEntity(entity.id)
        cell.entities.push(entity)
    }

}