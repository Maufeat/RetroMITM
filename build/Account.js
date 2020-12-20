"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = __importDefault(require("net"));
var Map_1 = __importDefault(require("./Map"));
var Utils_1 = __importDefault(require("./Utils"));
var Account = /** @class */ (function () {
    function Account() {
        this.welcomeKey = "";
        this.currentMap = new Map_1.default();
        this.currentCell = null;
        this.inFight = false;
        this.castedSpell = false;
        this.startPosition = 301;
        this.dofusClient = new net_1.default.Socket();
        this.toServer = new net_1.default.Socket();
    }
    Account.prototype.init = function (_socket) {
        var _this = this;
        this.dofusClient = _socket;
        this.dofusClient.on('data', function (data) {
            console.log("[C>AS]" + data);
            _this.toServer.write(data);
        });
        this.toServer = new net_1.default.Socket();
        this.toServer.on('connect', function () {
            console.log("Connected to Dofus AuthServer");
        });
        this.toServer.on('data', function (data) {
            if (data.toString().startsWith("AXK")) {
                var decrypt = Utils_1.default.decryptAXK(data.toString());
                _this.welcomeKey = decrypt[1];
                _this.dofusClient.write("AYK127.0.0.1:446;" + _this.welcomeKey);
            }
            else {
                _this.dofusClient.write(data);
            }
        });
        this.toServer.connect(443, "co-retro.ankama-games.com");
    };
    Account.prototype.changeServer = function (newSocket) {
        var _this = this;
        this.toServer.destroy();
        this.toServer = new net_1.default.Socket();
        this.dofusClient = newSocket;
        this.toServer.on('data', function (data) {
            _this.handleServerMessage(data);
        });
        this.dofusClient.on('data', function (data) {
            console.log("[C>GS] " + data);
            _this.handleIncomingPacket(data);
        });
        //Mono X
        this.toServer.connect(443, "172.65.251.16");
    };
    Account.prototype.handleIncomingPacket = function (data) {
        var _this = this;
        var packets = data.toString().replace('\x0a', '').split('\0');
        packets.forEach(function (packet) {
            if (packet != "") {
                if (data.toString().startsWith("BM*|!g")) {
                }
                else {
                    _this.toServer.write(data);
                }
            }
        });
    };
    Account.prototype.handleServerMessage = function (packet) {
        var _this = this;
        var packets = packet.toString().replace('\x0a', '').split('\0');
        packets.forEach(function (packet) {
            if (packet != "") {
                if (packet.startsWith("GTS200011936")) {
                    console.log("My turn starts.");
                    if (!_this.castedSpell) {
                        setTimeout(function () {
                            //Beben
                            _this.sendPacketToServer("GA300181;" + _this.startPosition);
                            setTimeout(function () {
                                //Gift
                                _this.sendPacketToServer("GA300196;" + _this.startPosition);
                                setTimeout(function () {
                                    //Baum werden
                                    _this.sendPacketToServer("GA300197;" + _this.startPosition);
                                    setTimeout(function () {
                                        //Runde beenden
                                        _this.castedSpell = true;
                                        _this.sendPacketToServer("Gt");
                                    }, Utils_1.default.getRandomInt(2000));
                                }, Utils_1.default.getRandomInt(2000));
                            }, Utils_1.default.getRandomInt(2000));
                        }, Utils_1.default.getRandomInt(2000));
                    }
                    else {
                        setTimeout(function () {
                            _this.sendPacketToServer("Gt");
                        }, Utils_1.default.getRandomInt(2000));
                    }
                }
                if (packet.startsWith("GPb-cicCcKeMeTfefj")) {
                    console.log("Start on outer ring.");
                    _this.startPosition = 301;
                    setTimeout(function () { _this.sendPacketToServer("Gp301"); }, Utils_1.default.getRandomInt(500, 1000));
                    setTimeout(function () { _this.sendPacketToServer("GR1"); }, Utils_1.default.getRandomInt(2000, 1500));
                }
                else if (packet.startsWith("GPc2c3")) {
                    console.log("Start on inner ring.");
                    _this.startPosition = 196;
                    setTimeout(function () { _this.sendPacketToServer("Gp196"); }, Utils_1.default.getRandomInt(500, 1000));
                    setTimeout(function () { _this.sendPacketToServer("GR1"); }, Utils_1.default.getRandomInt(2000, 1500));
                }
                if (packet.startsWith("GE")) {
                    _this.castedSpell = false;
                    _this.inFight = false;
                    console.log("Fight ends");
                }
                if (packet.startsWith("GDM")) {
                    _this.currentMap.refreshMap(packet.toString().substr(4));
                }
                if (packet.startsWith("GM")) {
                    var players = packet.toString().substr(3).split("|");
                    players.forEach(function (player) {
                        if (player.length != 0) {
                            var infos = player.substr(1).split(";");
                            if (player[0] == "+") {
                                var cell = _this.currentMap.getCellFromId(Number.parseInt(infos[0]));
                                var name_1 = infos[4];
                                var type = infos[5];
                                if (type.includes(","))
                                    type = type.split(",")[0];
                                switch (Number.parseInt(type)) {
                                    // Monster
                                    case -3:
                                        console.log("Monster on cellId: " + cell.id);
                                        _this.moveToCell(cell);
                                        break;
                                    // Characters are 1-12 (class id == type)
                                    default:
                                        console.log("Player: " + name_1 + " Type: " + type);
                                        if (name_1 == "Iggy") {
                                            console.log("I am on cell:" + cell.id);
                                            _this.currentCell = cell;
                                        }
                                        break;
                                }
                            }
                        }
                    });
                }
                //console.log("[GS>C] " + packet);
            }
        });
        /**/
        this.dofusClient.write(packet);
    };
    Account.prototype.sendPacketToServer = function (packet) {
        packet += "\n\x00";
        this.toServer.write(packet);
    };
    Account.prototype.moveToFight = function (id) {
        var packet = "GA001" + id;
        this.sendPacketToServer(packet);
    };
    Account.prototype.moveToCell = function (destination) {
        console.log("Move from " + this.currentCell.id + " to " + destination.id);
        var tempPath = this.getPath(this.currentCell, destination, [], false, 0);
        console.log("Move tempPath " + tempPath);
        console.log("MOVE: " + this.getPathfindingLimpio(tempPath));
        this.sendPacketToServer("GA001" + this.getPathfindingLimpio(tempPath));
    };
    Account.prototype.getPathfindingLimpio = function (cells) {
        var destination = cells[cells.length - 1];
        if (cells.length <= 2)
            return "";
        var pathfinder = "";
        var otherDirection = cells[1].getCharDirection(cells[0]);
        for (var i = 2; i < cells.length; i++) {
            var currentCell = cells[i];
            var anterioCell = cells[i - 1];
            var currentDir = currentCell.getCharDirection(anterioCell);
            if (otherDirection != currentDir) {
                pathfinder += otherDirection;
                pathfinder += Utils_1.default.getCellChar(anterioCell.id);
                otherDirection = currentDir;
            }
        }
        pathfinder += otherDirection;
        pathfinder += Utils_1.default.getCellChar(destination.id);
        return pathfinder;
    };
    Account.prototype.getPath = function (start, destination, not_permitted, detener_delante, distance) {
        var _this = this;
        var allowed_cells = [start];
        if (not_permitted.includes(destination))
            not_permitted = not_permitted.splice(not_permitted.indexOf(destination, 0), 1);
        var _loop_1 = function () {
            var index = 0;
            for (var i = 1; i < allowed_cells.length; i++) {
                if (allowed_cells[i].coste_f < allowed_cells[index].coste_f)
                    index = i;
                if (allowed_cells[i].coste_f != allowed_cells[index].coste_f)
                    continue;
                if (allowed_cells[i].coste_g > allowed_cells[index].coste_g)
                    index = i;
                if (allowed_cells[i].coste_g == allowed_cells[index].coste_g)
                    index = i;
                if (allowed_cells[i].coste_g == allowed_cells[index].coste_g)
                    index = i;
            }
            var actual = allowed_cells[index];
            if (detener_delante && this_1.getNodeDistance(actual, destination) <= distance && !destination.isWalkable())
                return { value: this_1.getCaminoRetroceso(start, actual) };
            if (actual == destination)
                return { value: this_1.getCaminoRetroceso(start, destination) };
            allowed_cells.splice(allowed_cells.indexOf(actual, 0), 1);
            not_permitted.push(actual);
            this_1.getAdjacency(actual).forEach(function (cell) {
                if (not_permitted.includes(cell) || !cell.isWalkable())
                    return;
                //if(cell.IsTeleportCell())
                var temporal_g = actual.coste_g + _this.getNodeDistance(cell, actual);
                if (!allowed_cells.includes(cell))
                    allowed_cells.push(cell);
                else if (temporal_g >= cell.coste_g)
                    return;
                cell.coste_g = temporal_g;
                cell.coste_h = _this.getNodeDistance(cell, destination);
                cell.coste_f = cell.coste_g + cell.coste_h;
                cell.parentCell = actual;
            });
        };
        var this_1 = this;
        while (allowed_cells.length > 0) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return [];
    };
    Account.prototype.getCaminoRetroceso = function (start, destination) {
        var actualCell = destination;
        var cells = [];
        while (actualCell != start) {
            cells.push(actualCell);
            actualCell = actualCell.parentCell;
        }
        cells.push(start);
        cells.reverse();
        return cells;
    };
    Account.prototype.getNodeDistance = function (a, b) {
        return ((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y));
    };
    Account.prototype.getAdjacency = function (cell) {
        var adjacency = [];
        var cell_up = this.currentMap.cells.filter(function (c) { return c.x == cell.x + 1 && c.y == cell.y; })[0];
        var cell_down = this.currentMap.cells.filter(function (c) { return c.x == cell.x - 1 && c.y == cell.y; })[0];
        var cell_left = this.currentMap.cells.filter(function (c) { return c.x == cell.x && c.y == cell.y + 1; })[0];
        var cell_right = this.currentMap.cells.filter(function (c) { return c.x == cell.x && c.y == cell.y - 1; })[0];
        if (cell_up != undefined)
            adjacency.push(cell_up);
        if (cell_down != undefined)
            adjacency.push(cell_up);
        if (cell_left != undefined)
            adjacency.push(cell_left);
        if (cell_right != undefined)
            adjacency.push(cell_right);
        var cell_sup = this.currentMap.cells.filter(function (c) { return c.x == cell.x - 1 && c.y == cell.y - 1; })[0];
        var cell_sdown = this.currentMap.cells.filter(function (c) { return c.x == cell.x + 1 && c.y == cell.y + 1; })[0];
        var cell_sleft = this.currentMap.cells.filter(function (c) { return c.x == cell.x - 1 && c.y == cell.y + 1; })[0];
        var cell_sright = this.currentMap.cells.filter(function (c) { return c.x == cell.x + 1 && c.y == cell.y - 1; })[0];
        if (cell_sup != undefined)
            adjacency.push(cell_sup);
        if (cell_sdown != undefined)
            adjacency.push(cell_sdown);
        if (cell_sleft != undefined)
            adjacency.push(cell_sleft);
        if (cell_sright != undefined)
            adjacency.push(cell_sright);
        return adjacency;
    };
    return Account;
}());
exports.default = Account;
