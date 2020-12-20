import Map from "./Map";


export default class CellX{
    
    id: number;
    type: CellTypes;
    active: boolean;
    x: number;
    y: number;

    coste_h: number = 0;
    coste_g: number = 0;
    coste_f: number = 0;

    //parentCell: Cell;

    constructor(_id: number, _type: number, _active: boolean, _map: Map){
        this.id = _id;
        this.type = _type;
        this.active = _active;            
        
        let loc5 = _id / ((_map.width * 2) - 1);
        let loc6 = _id - (loc5 * ((_map.width * 2) - 1));
        let loc7 = loc6 % _map.width;
        this.y = loc5 - loc7;
        this.x = (_id - ((_map.width - 1) * this.y)) / _map.width;
    }

    isWalkable(): boolean{
        return this.active && this.type != CellTypes.NOT_WALKABLE && this.type != CellTypes.INTERACTIVE_OBJECT;
    }

    getCharDirection(cell: Cell): string
    {
        if (this.x == cell.x)
            return cell.y < this.y ? (3 + 'a') : (7 + 'a');
        else if (this.y == cell.y)
            return cell.x < this.x ? (1 + 'a') : (5 + 'a');
        
        else if (this.x > cell.x)
            return this.y > cell.y ? (2 + 'a') : (0 + 'a');
        else if (this.x < cell.x)
            return this.y < cell.y ? (6 + 'a') : (4 + 'a');

        return "";
    }
}