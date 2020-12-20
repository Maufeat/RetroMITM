"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xml2js_1 = __importDefault(require("xml2js"));
var fs_1 = __importDefault(require("fs"));
var Cell_1 = __importDefault(require("./Cell"));
var Utils_1 = __importDefault(require("./Utils"));
var Map = /** @class */ (function () {
    function Map() {
        this.id = 0;
        this.width = 14;
        this.height = 18;
        this.x = 0;
        this.y = 0;
        this.map_data = "";
        this.cells = [];
    }
    Map.prototype.refreshMap = function (packet) {
        var _this = this;
        var _loc3 = packet.split("|");
        this.id = Number.parseInt(_loc3[0]);
        var parser = new xml2js_1.default.Parser();
        fs_1.default.readFile(__dirname + '\\..\\data\\maps\\' + this.id + '.xml', function (err, data) {
            parser.parseString(data, function (err, result) {
                _this.id = result.RECORD.ID;
                _this.width = result.RECORD.ANCHURA;
                _this.height = result.RECORD.ALTURA;
                _this.x = result.RECORD.X;
                _this.y = result.RECORD.Y;
                _this.decompressMap(result.RECORD.MAPA_DATA.toString());
            });
        });
        console.log("Current Map: " + this.id + " X:" + this.x + " Y:" + this.y);
    };
    Map.prototype.getCellFromId = function (id) {
        return this.cells[id];
    };
    Map.prototype.decompressMap = function (map_data) {
        var cells_value = "";
        for (var i = 0; i < map_data.length; i += 10) {
            cells_value = String(map_data).substr(i, 10);
            this.cells[i / 10] = this.decompressCell(cells_value, i / 10);
        }
    };
    Map.prototype.decompressCell = function (cellData, cellId) {
        var cellInformations = new Uint8Array(cellData.length);
        for (var i = 0; i < cellData.length; i++)
            cellInformations[i] = Utils_1.default.getHash(cellData.charAt(i));
        var type = (cellInformations[2] & 56) >> 3;
        var active = (cellInformations[0] && 32) >> 5 != 5;
        var linear_vision = (cellInformations[0] & 1) != 1;
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
        return new Cell_1.default(cellId, type, active, this);
    };
    return Map;
}());
exports.default = Map;
