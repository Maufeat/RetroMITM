"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellTypes = void 0;
var CellTypes;
(function (CellTypes) {
    CellTypes[CellTypes["NOT_WALKABLE"] = 0] = "NOT_WALKABLE";
    CellTypes[CellTypes["INTERACTIVE_OBJECT"] = 1] = "INTERACTIVE_OBJECT";
    CellTypes[CellTypes["TELEPORT_CELL"] = 2] = "TELEPORT_CELL";
    CellTypes[CellTypes["UNKNOWN1"] = 3] = "UNKNOWN1";
    CellTypes[CellTypes["WALKABLE"] = 4] = "WALKABLE";
    CellTypes[CellTypes["UNKNOWN2"] = 5] = "UNKNOWN2";
    CellTypes[CellTypes["PATH_1"] = 6] = "PATH_1";
    CellTypes[CellTypes["PATH_2"] = 7] = "PATH_2";
})(CellTypes = exports.CellTypes || (exports.CellTypes = {}));
var Cell = /** @class */ (function () {
    function Cell(_id, _type, _active, _map) {
        this.coste_h = 0;
        this.coste_g = 0;
        this.coste_f = 0;
        this.parentCell = null;
        this.id = _id;
        this.type = _type;
        this.active = _active;
        var loc5 = _id / ((_map.width * 2) - 1);
        var loc6 = _id - (loc5 * ((_map.width * 2) - 1));
        var loc7 = loc6 % _map.width;
        this.y = loc5 - loc7;
        this.x = (_id - ((_map.width - 1) * this.y)) / _map.width;
    }
    Cell.prototype.isWalkable = function () {
        return this.active && this.type != CellTypes.NOT_WALKABLE && this.type != CellTypes.INTERACTIVE_OBJECT;
    };
    Cell.prototype.getCharDirection = function (cell) {
        if (this.x == cell.x)
            return cell.y < this.y ? (3 + 'a') : (7 + 'a');
        else if (this.y == cell.y)
            return cell.x < this.x ? (1 + 'a') : (5 + 'a');
        else if (this.x > cell.x)
            return this.y > cell.y ? (2 + 'a') : (0 + 'a');
        else if (this.x < cell.x)
            return this.y < cell.y ? (6 + 'a') : (4 + 'a');
        return "";
    };
    return Cell;
}());
exports.default = Cell;
