"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var routing_controllers_1 = require("routing-controllers");
var bodyParser_1 = __importDefault(require("../utils/bodyParser"));
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.getAll = function (req, res) {
        return res.status(200).json({ hello: 'hello' });
    };
    UserController.prototype.post = function (req, res) {
        console.log(req);
        return res.status(200).json({ dd: 'd' });
    };
    __decorate([
        routing_controllers_1.Get('/hello'),
        __param(0, routing_controllers_1.Req()), __param(1, routing_controllers_1.Res()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], UserController.prototype, "getAll", null);
    __decorate([
        routing_controllers_1.Post('/test'),
        routing_controllers_1.UseBefore(bodyParser_1.default),
        __param(0, routing_controllers_1.Body()), __param(1, routing_controllers_1.Res()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], UserController.prototype, "post", null);
    UserController = __decorate([
        routing_controllers_1.JsonController()
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
