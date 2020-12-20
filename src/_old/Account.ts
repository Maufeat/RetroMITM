import { getPackedSettings } from 'http2';
import Net from 'net';
import { stringify } from 'querystring';
import Cell from './Cell';
import Character from './Character';
import Map from './Map';
import Utils from './Utils';

export default class AccountX {

    welcomeKey: string = "";

    dofusClient: Net.Socket;

    toServer: Net.Socket;

    currentMap: Map = new Map();

    currentCell: Cell = new Cell(4, 0, false, new Map());

    constructor(){

        this.dofusClient = new Net.Socket();
        this.toServer = new Net.Socket();
    }

    init(_socket: Net.Socket){

        this.dofusClient = _socket;
        
        this.dofusClient.on('data', (data: Buffer) =>{
            if(data.toString().startsWith("CONNECT")){
                var packet = data.toString().substr("CONNECT".length + 1)[1].split(":");
                console.log(`ip: ${packet[0]} port: ${packet[1]}`)
            }
            this.toServer.write(data);
        })

        this.toServer = new Net.Socket();

        this.toServer.on('connect', () => {
            console.log("Connected to Dofus AuthServer")
        });

        this.toServer.on('data', (data: Buffer) => {
            if(data.toString().startsWith("AXK")){
                let decrypt = Utils.decryptAXK(data.toString());
                this.welcomeKey = decrypt[1];
                this.dofusClient.write("AYK127.0.0.1:446;" + this.welcomeKey);
            } else {
                this.dofusClient.write(data);
            }
        });
            
        //this.toServer.connect(443, "co-retro.ankama-games.com");
    }

    changeServer(newSocket: Net.Socket){

        this.toServer.destroy();
        this.toServer = new Net.Socket();
        this.dofusClient = newSocket;


        this.toServer.on('data', (data: Buffer) => {
            this.handleServerMessage(data);
        });

        this.dofusClient.on('data', (data: Buffer) =>{
            console.log("[C>GS] " + data);
            this.handleIncomingPacket(data);
        })

        //Mono X
        this.toServer.connect(443, "172.65.251.16");
    }
    
    handleIncomingPacket(data: Buffer){
        var packets = data.toString().replace('\x0a', '').split('\0');
        packets.forEach((packet) => {
            if(packet != ""){
                if(data.toString().startsWith("BM*|!g")){
                } else {
                    this.toServer.write(data);
                }
            }
        });
    }

    inFight: boolean = false;
    castedSpell: boolean = false;
    startPosition: number = 301;

    handleServerMessage(packet: Buffer){

        var packets = packet.toString().replace('\x0a', '').split('\0');
        packets.forEach((packet) => {
            if(packet != ""){
                if(packet.startsWith("GTS200011936")){
                    console.log("My turn starts.");
                    if(!this.castedSpell){
                        setTimeout(() => {
                            //Beben
                            this.sendPacketToServer("GA300181;" + this.startPosition) 
                            setTimeout(() => {
                                //Gift
                                this.sendPacketToServer("GA300196;" + this.startPosition)
                                setTimeout(() => {
                                    //Baum werden
                                    this.sendPacketToServer("GA300197;" + this.startPosition);
                                    setTimeout(() => {
                                        //Runde beenden
                                        this.castedSpell = true;
                                        this.sendPacketToServer("Gt");
                                    }, Utils.getRandomInt(2000))
                                }, Utils.getRandomInt(2000))
                            }, Utils.getRandomInt(2000))
                        }, Utils.getRandomInt(2000))
                    } else {
                        setTimeout(() => {
                            this.sendPacketToServer("Gt");
                        }, Utils.getRandomInt(2000));
                    }
                }
                if(packet.startsWith("GPb-cicCcKeMeTfefj")){

                    console.log("Start on outer ring.");
                    this.startPosition = 301;
                    
                    setTimeout(() => {this.sendPacketToServer("Gp301")}, Utils.getRandomInt(500, 1000));
                    setTimeout(() => {this.sendPacketToServer("GR1")}, Utils.getRandomInt(2000, 1500));

                } else if(packet.startsWith("GPc2c3")) {

                    console.log("Start on inner ring.");
                    this.startPosition = 196;

                    setTimeout(() => {this.sendPacketToServer("Gp196")}, Utils.getRandomInt(500, 1000));
                    setTimeout(() => {this.sendPacketToServer("GR1")}, Utils.getRandomInt(2000, 1500));

                }
                if(packet.startsWith("GE")){
                    this.castedSpell = false;
                    this.inFight = false;
                    console.log("Fight ends");
                }
                if(packet.startsWith("GDM")){
                    this.currentMap.refreshMap(packet.toString().substr(4));
                }
                if(packet.startsWith("GM")){
                    let players: string[] = packet.toString().substr(3).split("|");
                    players.forEach((player) => {
                        if(player.length != 0){
                            let infos = player.substr(1).split(";");
                            if(player[0] == "+"){
                                let cell: Cell = this.currentMap.getCellFromId(Number.parseInt(infos[0]));
                                let name: string = infos[4];
                                let type: string = infos[5];
                                if(type.includes(","))
                                    type = type.split(",")[0];
                                
                                switch(Number.parseInt(type)){
                                    // Monster
                                    case -3:
                                        console.log("Monster on cellId: " + cell.id);
                                        this.moveToCell(cell);
                                        break;
                                    // Characters are 1-12 (class id == type)
                                    default:
                                        console.log("Player: " + name + " Type: " + type);
                                        if(name == "Iggy"){
                                            console.log("I am on cell:" + cell.id);
                                            this.currentCell = cell;
                                        }
                                        break;
                                }    
                            }
                        } 
                    });
                }
                //console.log("[GS>C] " + packet);
            }
        })

        /**/

        this.dofusClient.write(packet);
    }

    sendPacketToServer(packet: string){
        packet += '\x0a\x00';
        this.toServer.write(packet);
    }

    moveToFight(id: number){
        let packet = "GA001" + id;

        this.sendPacketToServer(packet);
    }

    moveToCell(destination: Cell){
        console.log("Move from " + this.currentCell.id + " to " + destination.id);
        let tempPath = this.getPath(this.currentCell, destination, [], false, 0);
        console.log("Move tempPath " + tempPath);
        console.log("MOVE: " + this.getPathfindingLimpio(tempPath));
        this.sendPacketToServer("GA001" + this.getPathfindingLimpio(tempPath));
    }

    getPathfindingLimpio(cells: Cell[]): string{
        let destination: Cell = cells[cells.length-1];

        if(cells.length <= 2)
            return "";

        let pathfinder: string = "";
        let otherDirection = cells[1].getCharDirection(cells[0]);
        
        for(let i = 2; i < cells.length; i++){
            let currentCell: Cell = cells[i];
            let anterioCell: Cell = cells[i - 1];
            let currentDir: string = currentCell.getCharDirection(anterioCell);

            if(otherDirection != currentDir){
                pathfinder += otherDirection;
                pathfinder += Utils.getCellChar(anterioCell.id);

                otherDirection = currentDir;
            }
        }

        pathfinder += otherDirection;
        pathfinder += Utils.getCellChar(destination.id);
        return pathfinder;
    }

    getPath(start: Cell, destination: Cell, not_permitted: Cell[], detener_delante: boolean, distance: number)
    {
        let allowed_cells: Cell[] = [ start ];

        if (not_permitted.includes(destination))
            not_permitted = not_permitted.splice(not_permitted.indexOf(destination, 0), 1);

        while (allowed_cells.length > 0)
        {
            let index = 0;
            for(let i = 1; i < allowed_cells.length; i++) {

                if(allowed_cells[i].coste_f < allowed_cells[index].coste_f)
                    index = i;
                
                if(allowed_cells[i].coste_f != allowed_cells[index].coste_f)
                    continue;

                if(allowed_cells[i].coste_g > allowed_cells[index].coste_g)
                    index = i;

                if(allowed_cells[i].coste_g == allowed_cells[index].coste_g)
                    index = i;

                if(allowed_cells[i].coste_g == allowed_cells[index].coste_g)
                    index = i;
            }

            let actual = allowed_cells[index];

            if (detener_delante && this.getNodeDistance(actual, destination) <= distance && !destination.isWalkable())
                return this.getCaminoRetroceso(start, actual);

            if (actual == destination)
                return this.getCaminoRetroceso(start, destination);
            
            allowed_cells.splice(allowed_cells.indexOf(actual, 0), 1);
            not_permitted.push(actual);

            this.getAdjacency(actual).forEach((cell: Cell) => {
                if(not_permitted.includes(cell) || !cell.isWalkable())
                    return;
                //if(cell.IsTeleportCell())
                let temporal_g = actual.coste_g + this.getNodeDistance(cell, actual);

                if(!allowed_cells.includes(cell))
                    allowed_cells.push(cell);
                else if(temporal_g >= cell.coste_g)
                    return;
                
                cell.coste_g = temporal_g;
                cell.coste_h = this.getNodeDistance(cell, destination);
                cell.coste_f = cell.coste_g + cell.coste_h;
                //cell.parentCell = actual;
            });
        }

        return [];
    }

    getCaminoRetroceso(start: Cell, destination: Cell){
        let actualCell: Cell = destination;
        let cells: Cell[] = [];
        
        while(actualCell != start){
            cells.push(actualCell);
            //actualCell = actualCell.parentCell;
        }

        cells.push(start);
        cells.reverse();

        return cells;
    }

    getNodeDistance(a: Cell, b: Cell): number {
        return ((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y));
    }

    getAdjacency(cell: Cell): Cell[]{
        let adjacency: Cell[] = [];
        
        let cell_up = this.currentMap.cells.filter(c => c.x == cell.x + 1 && c.y == cell.y)[0];
        let cell_down = this.currentMap.cells.filter(c => c.x == cell.x - 1 && c.y == cell.y)[0];
        let cell_left = this.currentMap.cells.filter(c => c.x == cell.x && c.y == cell.y + 1)[0];
        let cell_right = this.currentMap.cells.filter(c => c.x == cell.x && c.y == cell.y - 1)[0];

        if(cell_up != undefined)
            adjacency.push(cell_up);
        if(cell_down != undefined)
            adjacency.push(cell_up);
        if(cell_left != undefined)
            adjacency.push(cell_left);
        if(cell_right != undefined)
            adjacency.push(cell_right);

        let cell_sup = this.currentMap.cells.filter(c => c.x == cell.x - 1 && c.y == cell.y - 1)[0];
        let cell_sdown = this.currentMap.cells.filter(c => c.x == cell.x + 1 && c.y == cell.y + 1)[0];
        let cell_sleft = this.currentMap.cells.filter(c => c.x == cell.x - 1 && c.y == cell.y + 1)[0];
        let cell_sright = this.currentMap.cells.filter(c => c.x == cell.x + 1 && c.y == cell.y - 1)[0];

        if(cell_sup != undefined)
            adjacency.push(cell_sup);
        if(cell_sdown != undefined)
            adjacency.push(cell_sdown);
        if(cell_sleft != undefined)
            adjacency.push(cell_sleft);
        if(cell_sright != undefined)
            adjacency.push(cell_sright);

        return adjacency;
    }
}