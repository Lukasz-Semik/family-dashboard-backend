"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var routing_controllers_1 = require("routing-controllers");
var CheckerController_1 = require("./controllers/CheckerController");
var APP = express_1.default();
var PORT = Number(process.env.PORT) || 8080;
APP.use(morgan_1.default('dev'));
routing_controllers_1.useExpressServer(APP, {
    routePrefix: '/api',
    controllers: [CheckerController_1.UserController],
});
APP.listen(PORT, function () {
    // tslint:disable no-console
    console.log("App is running on " + PORT);
    // tslint:enable
});
