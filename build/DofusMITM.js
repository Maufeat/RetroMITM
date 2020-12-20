"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = __importDefault(require("net"));
var Account_1 = __importDefault(require("./Account"));
var DofusMITM = /** @class */ (function () {
    function DofusMITM() {
        this.mySocket = new net_1.default.Socket();
        this.authServer = net_1.default.createServer();
        this.gameServer = net_1.default.createServer();
        this.account = new Account_1.default();
    }
    DofusMITM.prototype.setupAuthServer = function () {
        var _this = this;
        this.authServer.on("connection", function (client) {
            _this.account.init(client);
        });
    };
    DofusMITM.prototype.setupGameServer = function () {
        var _this = this;
        this.gameServer.on("connection", function (client) {
            _this.account.changeServer(client);
        });
    };
    DofusMITM.prototype.start = function () {
        this.setupAuthServer();
        this.setupGameServer();
        this.authServer.listen(443, "127.0.0.1");
        this.gameServer.listen(446, "127.0.0.1");
    };
    return DofusMITM;
}());
exports.default = DofusMITM;
